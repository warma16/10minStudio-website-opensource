import os
#读取这些图片，并将它们按照数字标号排序
i=0
for file in os.listdir('.'):
    if file.endswith('.jpg'):
        os.rename(file,str(int(i))+'.jpg')
        i+=1