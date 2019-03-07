<?php

require_once 'DB.php';

class gameControl extends Database
{
    public function __construct()
    {
        parent::__construct();
    }
    public function getFirstInfo($id)
    {
        $str = "SELECT games.name,progress,time,point FROM userprogress,games WHERE games.id=userprogress.gameId AND userId = $id";
        return $this->query($str);
    }
    public function getTop10($gameId,$type = 'time')
    {
        if ($type === 'time'){
            $str = "SELECT name,time FROM `userprogress`,users WHERE users.id=userId AND gameId=$gameId ORDER BY `time` ASC LIMIT 10";
        }
        elseif ($type === 'point'){
            $str = "SELECT name,point FROM `userprogress`,users WHERE users.id=userId AND gameId=$gameId ORDER BY point DESC LIMIT 10";
        }
//        $str = ($type === 'time')?"SELECT * FROM `userprogress` WHERE point IS NULL AND gameId=$gameId ORDER BY `time` ASC LIMIT 10":($type === 'point')? "SELECT * FROM `userprogress` WHERE time IS NULL AND gameId=$gameId ORDER BY point DESC LIMIT 10":'';
        return $this->query($str);
    }
    public function updateDetails(int $userId,int $gameId, $time = NULL, $progress = 1, $points = NULL)
    {
        $arr = $this->getDetails($userId,$gameId);
        if(!empty($arr)){
            if(!empty($arr[0]['time'])){
                $str = (+$this->getTime($arr[0]['time']) > +$this->getTime($time))? "UPDATE `userprogress` SET `time`='$time' WHERE id={$arr[0]['id']}": '';
            }
            elseif (!empty($arr[0]['point'])){
                $str = (+$points > +$arr[0]['point'])? "UPDATE `userprogress` SET `point`='$points' WHERE id={$arr[0]['id']}": '';
            }
        }
        else{
            $str = "INSERT INTO `userprogress`(`gameId`, `userId`, `progress`, `time`, `point`) VALUES ($gameId,$userId,$progress,'$time','$points')";
        }
        if($str) $this->query($str);
    }
    private function getTime($time)
    {
        return substr($time,0,2).substr($time,3);
    }
    public function getDetails($userId,  $gameId = NULL)
    {
        $str = ($gameId)? "SELECT * FROM userprogress WHERE userId=$userId AND gameId=$gameId" : "SELECT * FROM userprogress WHERE userId=$userId";
        return $this->query($str);
    }
}
