<?php

require_once 'Database.php';

class User
{
    const TABLE = 'users';
	protected $db;
	const CHECKED = true;
	public function __construct()
	{
		$this->db = new Database;
        date_default_timezone_set('Asia/Yerevan');
	}
    protected function checkArray($arr,$type = 'login')
    {
        $needKeys = [
            'login'=>['login','pass'],
            'registration'=>['name','surname','login','email','phone','password','retype']
        ][$type];
        $bool = true;
        foreach ($arr as $key => $value){
            if(array_search($key,$needKeys) === FALSE){
                $bool = false;
                break;
            }
        }
        if (!$bool) throw new Exception("Սխալ արգումենտներ. Մի փորձեք վնասել կայքը։  ))))");
    }
	protected function getDate()
    {
        return time()+24*3600*7;
    }
	protected function tokenGenerator($str)
    {
        return md5(uniqid($str));
    }
	protected function addCookie($token,$date,$id)
    {
        $this->db->query("INSERT INTO `token` (`token`, `expireDate`,`userId`) VALUES ('{$token}',{$date},{$id})");
        setcookie('tkn',$token,time()+24*7*3600,'/');
    }
    public function checkCookie($token,$date)
    {
        $token = addslashes($token);
        $answer = $this->db->query("SELECT `userId` FROM `token` WHERE token='$token'AND expireDate >= '$date'");
        return $answer ? $answer[0] : false;
    }
    public function deleteCookie($user, $token)
    {
        setcookie('tkn','',1,'/');
        return $this->db->query("DELETE FROM `token` WHERE `userId`='$user' AND `token`='$token'");
    }
    public function isLoginExists($login)
    {
        $answer = $this->db->query("SELECT login FROM ". self::TABLE ." WHERE login = '$login' ",'login');
        return !empty($answer);
    }
    public function isMailExists($email)
    {
        $answer = $this->db->query("SELECT email FROM ". self::TABLE ." WHERE email = '$email'",'email');
        return !empty($answer);
    }
    public function getUserInfo($userId){
        $answer = $this->db->query("SELECT name, id, login, email FROM `users` WHERE id = '$userId'");
        return $answer;
    }
}
