const request = require("request");
const config = require(`${process.cwd().replace(/\\/g, "/")}/controller/configApi.js`);
const log = require(`${process.cwd().replace(/\\/g, "/")}/controller/logger.js`);

function getNickname(qqnum, callback){
	var postData = {};
	postData.UserID = parseFloat(qqnum);
	postData = JSON.stringify(postData);
	request.post({
		url: `${config.get("global", "API_ADDRESS")}/v1/LuaApiCaller?qq=${config.get("global", "BOT_QQ_NUM")}&funcname=GetUserInfo&timeout=10`,
		headers: {
			"Content-Type": "application/json",
		},
		body: postData,
	},function(e, r, b){
		try{
			var response = JSON.parse(b);
		}catch(e){
			log.write("无法解析服务器返回的数据.", "用户信息获取失败", "WARNING");
			log.write("请检查后端服务器是否工作正常.", "用户信息获取失败", "WARNING");
			return false;
		}
		if(response.code == 0){
			var nickname = response.data.nickname
			callback(nickname);
		}else{
			log.write(`错误信息: <${response.Msg}>`, "用户信息获取失败", "WARNING");
			console.log(response);
			return false;
		}
	});
}

function isAdmin(qqnum, group = 0) {
	var admins = config.get("global", "GROUP_ADMINS");
	var groupAdmin = admins[eval(group.toString())];
	if (groupAdmin !== undefined) {
		if (groupAdmin.indexOf(qqnum.toString()) !== -1) {
			return true;
		} else {
			return false;
		}
	} else {
		if (admins["0"].indexOf(qqnum.toString()) !== -1) {
			return true;
		} else {
			return false;
		}
	}
}

function genGroupUserList() {

}

module.exports = {
	getNickname,
	isAdmin,
	genGroupUserList
};