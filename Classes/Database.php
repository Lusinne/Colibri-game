<?php

class Database 
{
	private $connection;
	public function __construct($host = 'newsecuadorec.ipagemysql.com',$user = 'colibri_game',$password = 'atasla',$db = 'colibri_game')
	{
		$this->connection = new mysqli($host ,$user ,$password ,$db );
		if($this->connection->connect_errno)
		{
		    die('connection error: ' . $this->connection->connect_error);
        }
	}

	public function query($query, $what = null)
	{
		$query = trim($query);
		$reg = !$what ? '/^[a-zA-Z0-9\'=*\s@,\(\)\.\:(>=|<=)`]*$/' : [
            'login' => '/^[a-zA-Z0-9\'=\s]*$/',
            'email' => '/^[a-zA-Z0-9\'=*\s@\.]*$/',
            'insert' => '/^[a-zA-Z0-9\'=*\s@,\(\)\.]*$/',
            'select' => '/^[a-zA-Z0-9\'=*\s@,\(\)\.]*$/'
        ][$what];

		if(!preg_match($reg, $query)) return false;
		$result = $this->connection->query($query);
		if(!$result)
        {
            die('Query error: ' . $this->connection->error);
        }
        return (stripos($query, 'SELECT') !== FALSE) ? $result->fetch_all(MYSQLI_ASSOC) : $result;
	}
	public function insertId()
    {
    	return $this->connection->insert_id;
    }
    public function __destruct()
    {
        $this->connection->close();
    }
}

