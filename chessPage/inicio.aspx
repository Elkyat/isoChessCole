<%@ Page Language="VB" AutoEventWireup="false" CodeFile="inicio.aspx.vb" Inherits="inicio" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   <meta charset="utf-8" />
<title>ChessMania</title>
<link rel="stylesheet" href="wwwroot/css/inicio.css"/>
</head>
<body>
    <img src="wwwroot/resources/logo.png" alt="Logo" class="logo" />
<div class="square">
    <div class="left-section">
        <!-- Background image is here -->
    </div>
    <div class="right-section">
        <div class="top-rectangle"></div> <!-- Rectangle above Welcome title -->
        <h1 class="welcome-title">Welcome</h1>
        <a href="Register.html" class="link-text">Don't have an account?</a> <!-- Link below Welcome title -->
        <form class="login-form">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button href="Index.aspx" type="submit">Login</button>
        </form>
        <div class="bottom-rectangle"></div> <!-- Rectangle below Welcome title -->
    </div>
</div>
</body>
</html>
