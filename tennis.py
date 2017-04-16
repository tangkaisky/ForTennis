#!/usr/bin/Python
#coding: utf-8

'''Tennis Shot'''

import tornado.ioloop
import tornado.web
import os
import re
import urllib

#utf-8
#import sys
#reload(sys)
#sys.setdefaultencoding('utf-8')
import sys
default_encoding = 'utf-8'
if sys.getdefaultencoding() != default_encoding:
    reload(sys)
    sys.setdefaultencoding(default_encoding)

path = os.path.abspath(os.path.dirname(sys.argv[0])) #directory for windows&linux 
#匹配字符
# re_word1 = re.compile(u'[\u4e00-\u9fa5]{0,20}')
# re_word2 = re.compile(r'[0-9a-zA-Z\r\n\_]{0,40}')

class BaseHandler(tornado.web.RequestHandler):
    pass

class HomePageHandler(BaseHandler):
    '''HomePage'''
    def get(self):
        infoJson = readInfo();   #DB={'':'',.}
        info_array = reversed(infoJson['people'])  #倒序，以便将最新注册的信息的置顶
        self.render('tennis_shot.html', info_array=info_array)

    def post(self):
        infoJson = readInfo();
        nameAdd = self.get_argument('nameAdd', '') #在genral.js里
        if nameAdd:
            infoJson = appointAddPeople(infoJson, nameAdd)
            writeInfo(infoJson)
        else:
            temp = getFormInfo(self)
            infoJson['people'].append(temp)
            infoJson['count'] += 1      #+111111111111111
            writeInfo(infoJson)


class MapHandler(BaseHandler):
    '''Map_appoint'''
    def get(self):
        self.render('appoint.html', position='')


    def post(self):
        person = self.get_argument('person', '')
        if not person:
            self.render('appoint.html', position='')
        else:
            infoJson = readInfo();
            position = getPositionByName(person, infoJson)
            self.render('appoint.html', position=position)


class WeatherHandler(BaseHandler):
    def get(self):
        self.render('weather.html')


def getFormInfo(self):  #读取浏览器新的表单信息构造成json形式
    name = self.get_argument('name', '')
    time = self.get_argument('time', '')
    location = self.get_argument('location', '')
    NTRP = self.get_argument('NTRP', '')
    information = self.get_argument('information', '')
    appoint_people = self.get_argument('appoint_people', '')
    x = self.get_argument('x', '')
    y = self.get_argument('y', '')
    #此处过滤特殊字符未成功
    # name_test = str(name).decode('utf-8')
    # time_test = str(time).decode('utf-8')
    # info_test = str(information).decode('utf-8')
    # location_test = str(location).decode('utf-8')
    # name1 = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),name_test)
    # time1 = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),time_test)
    # information1 = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),info_test)
    # location1 = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),location_test)
    # if (re_word2.match(information1) or re_word1.match(information1)) and (re_word1.match(name1) or re_word2.match(name1)) and (re_word1.match(time1) or re_word1.match(time1)) and (re_word1.match(location1) or re_word1.match(location1)):
    return {
            'name':str(name),
            'time':str(time),
            'location':str(location),
            'NTRP':str(NTRP),
            'information':str(information),
            'appoint_people':int(appoint_people),
            'x':str(x),
            'y':str(y),
            }

def readInfo():
    '''return information of Json'''
    info_file = open(path+r'/static/database/database.js')
    temp = info_file.readlines()
    info_file.close()
    temp = ''.join(temp)   #将上面的list得到原来的db
    temp = re.split('[\n\r]+', temp)
    temp = ''.join(temp)
    exec(temp)    #执行表达式DB={...}
    return DB

def appointAddPeople(infoJson, name):
    '''search name And add 1 to appoint_people'''
    for i in infoJson['people']:
        if i['name'] == name:
            i['appoint_people'] = i['appoint_people'] + 1
            break
    return infoJson

def writeInfo(infoJson):
    jsonString = 'DB = ' + str(infoJson)
    info_file = open(path+r'/static/database/database.js', 'w')
    info_file.write(jsonString)
    info_file.close()

def getPositionByName(name, infoJson):
    temp = infoJson['people']
    for person in temp:    #每个人信息dic
        if name == person['name']:
            return person['x'] + ';' + person['y']
    return ''

settings = {
    "template_path": os.path.join(os.path.dirname(__file__), "templates"), #路径
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    'debug': 'True',
}

application = tornado.web.Application([   #重定向url
    (r'/', HomePageHandler),
    (r'/map', MapHandler),
    (r'/weather', WeatherHandler)
], **settings)

if __name__ == "__main__":
    print '运行成功...'
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

