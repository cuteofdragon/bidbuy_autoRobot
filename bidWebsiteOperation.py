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

#操作網站的class
class bidWebsiteOperation:
    def __init__(self,main_url,auid):
        self.main_url = main_url
        self.auid = auid
    def bid_price(self,n_times=1):
        ### bidding price ###
        home_url=self.main_url+'/home/home00/index'
        req_session=Session()
        cookie = '; '.join(['='.join(s) for s in req_session.get(home_url).cookies.items()])
        hds={
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Host': 'shwoo.gov.taipei',
            'Origin': 'https://shwoo.gov.taipei',
            'Referer': self.main_url+'/home/home00/index',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
        }
        hds['Referer']=self.main_url+'/product/product00/product?AUID='+self.auid
        pl={ 'message': '{"no":1,"auid":"%s"}'%self.auid }
        new_price_json=json.loads(requests.post(self.main_url+'/product/product00/websocket', data=pl, timeout=0.8).json())
        price_now = new_price_json['money']
        return price_now
        #####################
    ##############################################################################################
    def check_first_bidder(self,account):
        first_account=""
        for i in range(0,10):
            try:
                first_account = json.loads(requests.post(self.main_url+'/product/product00/websocket', data={'message':'{"no":3,"auid":"%s"}'%self.auid,}, timeout=0.8).json())['detail'][0]
            except:
                print('check timeout')
                continue
            if first_account: 
                break
        if first_account !="":
            if '得標' in first_account['account']: 
                return 'end'
            if (account[:-2]+"**") not in first_account['account']:
                print('[NOT YOU]', first_account['account'], first_account['bidprice'])
            else: 
                print(first_account['account'], first_account['bidprice'])
                return 1
    ##############################################################################################

    def processPic_bid(self,filepath):
        img = Image.open(filepath).crop((0,0,120,35))
        #from matplotlib.pyplot import imshow
        #imshow(img)
        img = img.resize((120,35))
        im = np.array(img)
        X = np.zeros((1, 35,120, 3), dtype=np.float32)
        X[0] = im / 255.0
        return X