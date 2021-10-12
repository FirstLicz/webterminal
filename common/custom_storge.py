from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from django.conf import settings
import stat
from pathlib import Path
import logging

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

    def _open(self, name, mode="rb"):
        pass

    def _save(self, name, **kwargs):
        pass

    # 本地存储，需要重写
    # def path(self, name):
    #     """
    #     Return a local filesystem path where the file can be retrieved using
    #     Python's built-in open() function. Storage systems that can't be
    #     accessed using open() should *not* implement this method.
    #     """
    #     raise NotImplementedError("This backend doesn't support absolute paths.")

    # The following methods form the public API for storage systems, but with
    # no default implementations. Subclasses must implement *all* of these.

    def delete(self, name):
        """
        Delete the specified file from the storage system.
        """
        filename = Path(self.sftp.getcwd(), name).as_posix()
        self.sftp.remove(filename)

    def exists(self, name):
        """
        Return True if a file referenced by the given name already exists in the
        storage system, or False if the name is available for a new file.
        """
        filename = Path(self.sftp.getcwd(), name).as_posix()
        try:
            self.sftp.stat(filename)
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
        filename = Path(self.sftp.getcwd(), name).as_posix()
        return self.sftp.stat(filename).st_size

    def url(self, name):
        """
        Return an absolute URL where the file's contents can be accessed
        directly by a Web browser.
        """
        return Path(self.sftp.getcwd(), name).as_posix()

    def get_accessed_time(self, name):
        """
        Return the last accessed time (as a datetime) of the file specified by
        name. The datetime will be timezone-aware if USE_TZ=True.
        """
        filename = Path(self.sftp.getcwd(), name).as_posix()
        return self.sftp.stat(filename).st_atime

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
        filename = Path(self.sftp.getcwd(), name).as_posix()
        return self.sftp.stat(filename).st_mtime

    def stat(self, name):
        filename = Path(self.sftp.getcwd(), name).as_posix()
        return self.sftp.lstat(filename)
