from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from django.conf import settings
import stat
from pathlib import Path
import logging
import io
import os
import tarfile

logger = logging.getLogger("test" if settings.DEBUG else "default")


@deconstructible
class SFTPStorage(Storage):

    def __init__(self, token):
        if not token:
            raise ValueError("没有会话ID")
        self.token = token
        if not settings.TERMINAL_SESSION_DICT[token]:
            raise KeyError(f"{token} not existed")
        self.sftp = settings.TERMINAL_SESSION_DICT[token].ssh.open_sftp()

    def __del__(self):
        self.sftp.close()

    def _open(self, filename, mode='rb'):
        return self.sftp.open(filename, mode)

    def write(self, name, fl):
        s = self.sftp.stat(name)
        size = self.sftp.getfo(name, fl)
        if s.st_size != size:
            raise IOError(
                "size mismatch in get!  {} != {}".format(s.st_size, size)
            )

    def _save(self, files, path):
        """
            保存到 remote Path
        """
        for file in files:
            file_size = file.size
            remote_path = Path(path, file.name).as_posix()
            logger.info(f"remote_path = {remote_path}")
            self.sftp.putfo(file, remote_path, file_size, None, True)

    def save(self, name, content, max_length=None):
        """
            保存到本地目录
            name: remote path
            content: files => io.BytesIO object
        """
        return self._save(content, name)

    # The following methods form the public API for storage systems, but with
    # no default implementations. Subclasses must implement *all* of these.

    def delete(self, name):
        """
        Delete the specified file from the storage system.
        """
        self.sftp.remove(name)

    def exists(self, name):
        """
        Return True if a file referenced by the given name already exists in the
        storage system, or False if the name is available for a new file.
        """
        try:
            self.sftp.stat(name)
            return True
        except:
            return False

    def listdir(self, path):
        """
        List the contents of the specified path. Return a 2-tuple of lists:
        the first item being directories, the second item being files.
        """
        dirs, files = list(), list()
        # 每次 切换目录
        self.sftp.chdir(path)
        for elem in self.sftp.listdir_attr():
            if elem.filename.startswith("."):
                continue
            elif stat.S_ISDIR(elem.st_mode):
                dirs.append(elem.filename)
            elif stat.S_ISLNK(elem.st_mode):
                _path = self.sftp.readlink(Path(path, elem.filename).as_posix())
                tmp = self.sftp.stat(_path)
                if stat.S_ISDIR(tmp.st_mode):
                    dirs.append(elem.filename)
                else:
                    dirs.append(elem.filename)
            else:
                files.append(elem.filename)
        return dirs, files

    def size(self, name):
        """
        Return the total size, in bytes, of the file specified by name.
        """
        # sftp_client.stat
        return self.sftp.stat(name).st_size

    def url(self, name):
        """
        Return an absolute URL where the file's contents can be accessed
        directly by a Web browser.
        """
        return Path(name).as_posix()

    def get_accessed_time(self, name):
        """
        Return the last accessed time (as a datetime) of the file specified by
        name. The datetime will be timezone-aware if USE_TZ=True.
        """
        return self.sftp.stat(name).st_atime

    # def get_created_time(self, name):
    #     """
    #     Return the creation time (as a datetime) of the file specified by name.
    #     The datetime will be timezone-aware if USE_TZ=True.
    #     """
    #     raise NotImplementedError('subclasses of Storage must provide a get_created_time() method')

    def get_modified_time(self, name):
        """
        Return the last modified time (as a datetime) of the file specified by
        name. The datetime will be timezone-aware if USE_TZ=True.
        """
        return self.sftp.stat(name).st_mtime

    def stat(self, name):
        return self.sftp.lstat(name)

    def is_dir(self, name):
        if stat.S_ISDIR(self.stat(name).st_mode):
            return True
        return False

    def get_remote_files(self, remote_path):
        """
            获取文件夹列表
        """
        for elem in self.sftp.listdir_attr(remote_path):
            if stat.S_ISDIR(elem.st_mode):
                yield from self.get_remote_files(Path(remote_path, elem.filename).as_posix())
            else:
                yield Path(remote_path, elem.filename).as_posix()

    def download_folder(self, remote_path, local_path):
        try:
            for elem in self.get_remote_files(remote_path):
                target_dir = Path(local_path, elem[1:])  # 去除根 目录 / 的影响
                if not target_dir.parent.is_dir():
                    os.makedirs(target_dir.parent.as_posix())
                self.sftp.get(elem, target_dir.as_posix())
            path = Path(local_path, remote_path[1:]).as_posix()
            logger.info(f"tarfile path = {path}")
            return self.tarfile(path)
        except:
            return

    def tarfile(self, path):
        # tar.filename.gz
        name = Path(path).name
        target_path = Path(path).parent
        target_gz_file = Path(target_path.as_posix(), f"{name}.tar.gz")
        t = tarfile.open(target_gz_file.as_posix(), "w:gz")
        # 使用 pathlib
        for file in Path(path).rglob("*.*"):
            logger.debug(f"arcname = {Path(name, file.name).as_posix()}")
            t.add(file.as_posix(), arcname=Path(name, file.name).as_posix())
        t.close()
        return target_gz_file.as_posix()


class CustomSFTPFile:

    def __init__(self, storage: SFTPStorage = None, filename=None):
        self.storage = storage
        self.filename = filename
        self.file = io.BytesIO()

    def download(self):
        if stat.S_ISDIR(self.storage.stat(name=self.filename)):
            ssh2_tmp_dir = os.path.join(settings.MEDIA_ROOT, "ssh2_tmp")
            if os.path.isdir(ssh2_tmp_dir):
                os.makedirs(ssh2_tmp_dir, exist_ok=True)
            tmp_session_id = os.path.join(ssh2_tmp_dir, self.storage.token)
            if os.path.isdir(tmp_session_id):
                os.makedirs(tmp_session_id, exist_ok=True)

        else:
            self.storage.write(self.filename, self.file)
            self.file.seek(0)

