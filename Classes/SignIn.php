<?php
require_once 'User.php';

class SignIn extends User
{
    public function __construct(array $user)
    {
        parent::__construct();
        try{
            $this->checkArray($user);
        }catch (Exception $e){
            echo '<h1>Error: ', $e -> getMessage().'</h1>';
            die;
        }
    }
    public function sign(array $user)
    {
        $login = strtolower(addslashes(trim($user['login'])));
        $password = md5($user['pass']);
        $answer = $this->db->query("SELECT `id`,`name`, `login`, `email` FROM ". self::TABLE ." WHERE (login='$login' OR email='$login' ) AND password='$password'");
        if(!empty($answer)){
            $date = $this->getDate();
            $token = $this->tokenGenerator($login);
            $id = $answer[0]['id'];
            $this->addCookie($token,$date,$id);
        }
        return $answer ?: false;
    }
}
