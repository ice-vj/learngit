#######################################
# 服务生成image所需要的dockerfile
# 一般不需要RD修改，可能需要修改的带有[todo]
#######################################

#######################################
# 基础镜像，使用alpine最小镜像
#######################################
FROM test-harbor.haofenshu.com/hfs/node-alpine-master-ci:v0.4

#######################################
# 标识负责的小组[todo]
#######################################
MAINTAINER hfs-backend

#######################################
# 定义使用的环境变量
#######################################
# 运行环境，安装不同的依赖包，使用对应的配置
# production: 生产环境，只会安装生产环境的依赖包
# development: 开发环境，安装所有的依赖包
# test: 测试环境，安装所有依赖包
ENV NODE_ENV production
# 全量日志开关，on | off
ENV FULL_LOG off

#######################################
# 创建并设置工作目录
#######################################
# 容器内默认统一使用/usr/src/app目录
RUN mkdir -p /usr/src/app/logs
WORKDIR /usr/src/app

#######################################
# 拷贝程序并安装依赖
#######################################
# 拷贝当前目录到容器内，忽略的文件依赖当前目录下的
# .dockerignore文件，其格式与.gitignore相同
COPY . /usr/src/app

#######################################
# 使用的ssh key在基础镜像中集成了，此处不用关心
#######################################
RUN cnpm install

#######################################
# 默认容器启动命令，可以被run覆盖
#######################################
CMD ["node", "./bin/www"]


