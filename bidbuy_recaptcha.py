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
from bidWebsiteOperation import bidWebsiteOperation
from clipboardController import clipboradAction

class bidbuy(clipboradAction,bidWebsiteOperation):
    def __init__(self,maxPrice,main_url,auid):
        self.characters = '0123456789abcdefghijklmnopqrstuvwxyz'
        self.bid_model=keras.models.load_model('model/bid_model.h5')
        self.maxPrice = maxPrice
        self.main_url = main_url
        self.auid = auid
        self.nowPrice = 0
        try:
            self.nowPrice = self.bid_price(self.auid)
        except:
            print ("查價功能被網站封鎖，請稍後再試")
        pass
    def main(self):
        while True:
            try:
                ReadClipResult = self.ReadClipboard()
                if ReadClipResult == "OK":
                    try:
                        self.nowPrice = self.bid_price(self.auid)
                        print("目前金額:$%s" % self.nowPrice)
                        #查價，但是如果發生查價問題，那就一樣辨識，不管現在多少錢
                        if int(self.nowPrice) >= int(self.maxPrice):
                            print ('超過最高投標金額，停止驗證碼辨識')
                            continue
                    except:
                        print ("查價功能被網站封鎖，請稍後再試")
                        
                    X = self.processPic_bid('img.jpeg')
                    predicted = ''
                    for p in self.bid_model.predict(X):
                        predicted += self.characters[(np.argmax(p))]
                    print(predicted)
                    self.copy_toClipboard(predicted)
                time.sleep(0.01)
            except:
                pass

main_url='https://shwoo.gov.taipei/shwoo'

diffTime = time.time()-(int(json.loads(requests.post(main_url+'/product/product00/websocket', data={'message':'{"no":4}'}).json())['serverTime'])/1000)
print ("v1.1")
if diffTime > 0:
    print ('結果為正 表示測試的電腦比惜物網"快" %s 秒' % diffTime)
else:
    print ('結果為正 表示測試的電腦比惜物網"慢" %s 秒' % diffTime)
print("請校正您的按鍵精靈啟動時間")


account  = input('02.帳　　號:　') 
auid = input('01.投標物件: ')

WebsiteOperation = bidWebsiteOperation(main_url,auid)
WebsiteOperation.check_first_bidder(account)
price_now = WebsiteOperation.bid_price()
maxPrice  = input('02.目前價格$%s，最高投標金額: '% price_now)
_bidbuy = bidbuy(maxPrice,main_url,auid)
_bidbuy.main()
