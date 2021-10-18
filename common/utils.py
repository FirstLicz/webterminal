import mimetypes
import os
from urllib.parse import quote, urlparse
from django.http.response import FileResponse, StreamingHttpResponse


class SFTPFileResponse(StreamingHttpResponse):

    def __init__(self, streaming_content=(), filename="", *args, **kwargs):
        super(SFTPFileResponse, self).__init__(streaming_content, *args, **kwargs)
        self.set_headers(filename)

    def set_headers(self, filename, as_attachment=False):
        """
        Set some common response headers (Content-Length, Content-Type, and
        Content-Disposition) based on the `filelike` response content.
        """
        encoding_map = {
            'bzip2': 'application/x-bzip',
            'gzip': 'application/gzip',
            'xz': 'application/x-xz',
        }
        if self.headers.get('Content-Type', '').startswith('text/html'):
            if filename:
                content_type, encoding = mimetypes.guess_type(filename)
                # Encoding isn't set to prevent browsers from automatically
                self.headers['Content-Type'] = content_type or 'application/octet-stream'
            else:
                self.headers['Content-Type'] = 'application/octet-stream'

        if filename:
            disposition = 'attachment'
            try:
                filename.encode('ascii')
                file_expr = 'filename="{}"'.format(filename)
            except UnicodeEncodeError:
                file_expr = "filename*=utf-8''{}".format(quote(filename))
            self.headers['Content-Disposition'] = '{}; {}'.format(disposition, file_expr)

