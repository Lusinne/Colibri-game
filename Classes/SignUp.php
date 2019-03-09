<?php
require_once 'User.php';

class SignUp extends User
{
    public function __construct(array $user)
    {
        parent::__construct();
        try{
            $this->checkArray($user,'registration');
        }catch (Exception $e){
            echo '<h1>Error: ', $e -> getMessage().'</h1>';
            die;
        }
    }
    public function registration(array $registration = [])
    {

        foreach ($registration as $key => $value){
            if($key === 'password' || $key === 'retype'){
                $registration[$key] = md5($value);
            }
            elseif($key === 'surname' && empty($value)){
                unset($registration[$key]);
                continue;
            }
            else{
                $registration[$key] = strtolower(addslashes(trim($value)));
            }
            $$key = $registration[$key];
        }
        switch(true){
            case $this->registration_all($registration):
            case $this->isEmpty($registration):
            case $this->checkEquality($password, $retype):
            case $this->isLoginExists($login):
            case $this->isMailExists($email):
            case $this->checkPhone($phone);
            case $this->checkReg($login);
            case $this->checkReg($email,'email');
                return false;
        }
//        return 'aaa';
        $keys = $this->getKeys($registration);
        $fields = $this->getFields($registration);

        if($this->db->query("INSERT INTO ". self::TABLE ." (".implode(',',$keys).") VALUES ('".implode("','",$fields)."')")){
            $date = $this->getDate();
            $token = $this->tokenGenerator($login);
            $id = $this->db->insertId();
            $this->addCookie($token,$date,$id);
            $newUser = ['id' => $id, 'name' => ucfirst($name), 'login' => $login, 'email' => $email];
            return $newUser;
        }
        return false;
    }
    public function checkReg($str,$type = 'login')
    {
        $reg = [
            'login'=>'/^\w{4,30}$/',
            'email' => '/^[0-9a-zA-Z\._]{3,63}@[a-zA-Z]{2,6}.[a-zA-Z]{2,6}$/'
        ][$type];
        return !preg_match($reg,$str);
    }
    private function registration_all($registration)
    {
        return (count($registration) !== 6 && count($registration) !== 7);
    }
    private function getFields($fields)
    {
        $arr = [];
        foreach ($fields as $key => $value)
        {
            if($key !== 'retype')
            {
                if($key === 'name' || $key === 'surname' )
                {
                    $value = ucfirst(strtolower($value));
                }
                elseif ($key === 'login')
                {
                    $value = strtolower($value);
                }
                $arr[] = $value;
            }
        }
        return $arr;
    }
    private function checkPhone(string $phone)
    {
        if(strlen($phone) !== 9) return true;
        $allowedNumbers = [10, 11, 91, 93, 94, 95, 96, 97, 98, 99, 77, 55, 41, 43, 44];
        $phone = preg_replace('/[^0-9]/','',$phone);
        if(count(array_filter(str_split($phone),function($value){
            return strlen((int)$value) !== strlen($value);
        })) !== 0 || count(str_split($phone)) !== 8) return true;
        if(count(str_split($phone)) !== 8) return true;
        return !in_array(+substr($phone,0,2), $allowedNumbers);
    }
    private function getKeys($reg)
    {
        $keys = [];
        foreach ($reg as $key => $value)
        {
            if($key !== 'retype')
            {
                $keys[] = $key;
            }
        }
        return $keys;
    }
    private function isEmpty(array $registration)
    {
        foreach ($registration as $key => $value) {
            if (empty($value))  return true;
        }
        return false;
    }
    private function checkEquality($password, $retype)
    {
        return $password !== $retype;
    }
    public function getUsers($login)
    {
        $answer = $this->db->query("SELECT login FROM". self::TABLE ."WHERE login != '$login'");
        return $answer ?: null;
    }
}
