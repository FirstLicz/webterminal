from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
import base64


class AesEncrypt:

    def __init__(self):
        self.key = b"lcz1234567890123"
        self.iv = b"lcz1234567890123"
        self.mode = AES.MODE_CBC
        self.aes = AES.new(self.key, self.mode, self.iv)

    def decrypt(self, data: str = None):
        try:
            base64_decrypted = base64.decodebytes(data.encode('utf-8'))
            una_pkcs7 = unpad(self.aes.decrypt(base64_decrypted), AES.block_size, style='pkcs7')
            decrypted_text = str(una_pkcs7, encoding='utf-8')
        except:
            return data
        return decrypted_text

    def encrypt(self, data: str = None):
        pad_pkcs7 = pad(data.encode('utf-8'), AES.block_size, style='pkcs7')
        result = base64.encodebytes(self.aes.encrypt(pad_pkcs7))
        encrypted_text = str(result, encoding='utf-8').replace('\n', '')
        return encrypted_text


if __name__ == '__main__':
    aes = AesEncrypt()
    password = aes.encrypt("bwda123!@#")
    print(password)
