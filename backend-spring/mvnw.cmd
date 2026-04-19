@echo off
setlocal enabledelayedexpansion

set DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
set WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar

if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven wrapper...
    curl -L -o "%WRAPPER_JAR%" %DOWNLOAD_URL%
)

java -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
