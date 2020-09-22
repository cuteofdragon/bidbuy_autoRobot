import requests,json,time
import threading
import datetime
from datetime import datetime
import requests,re,os,json
import time
from bs4 import BeautifulSoup
import numpy as np
import keras
import sys
import shutil
from requests import Session
import PIL.Image as Image
import win32clipboard,win32con
import io

#控制剪貼簿裡面的東西
class clipboradAction:
    def copy_toClipboard(self,text):
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardData(win32con.CF_UNICODETEXT, text)
        win32clipboard.CloseClipboard()
    def ReadClipboard(self):
        #拿剪貼簿裡面的東西，就同等於按下 Control + V
        win32clipboard.OpenClipboard() 
        data =""
        if win32clipboard.IsClipboardFormatAvailable(win32clipboard.CF_DIB):
            data = win32clipboard.GetClipboardData(win32clipboard.CF_DIB)
        win32clipboard.CloseClipboard() 
        try:
            image = Image.open(io.BytesIO(data))
            image.save('img.jpeg')
            return "OK"
        except:
            return "wait"