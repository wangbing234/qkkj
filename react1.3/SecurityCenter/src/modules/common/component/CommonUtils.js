
function vaildateHdfsPath(paths){
    for (let path of paths) {
        if(path.indexOf("/")==-1)
            return "路径必须以/开头";
    }
    return "";
}

export default {vaildateHdfsPath}