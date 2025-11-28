<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login | My Collections</title>
  <link rel="stylesheet" href="css/login_register.css" />
</head>
<body class="auth-page login-page">
    <div class="login-container">
    <h1>My Collections</h1>
    <h2>Login</h2>

    <form id="login-form">
      <label for="username">Username or Email</label>
      <input type="text" id="username" name="username" required />

      <label for="password">Password</label>

      <div class="password-wrapper">
        <input type="password" id="password" name="password" required />
        <button type="button" class="toggle-password">👁</button>
      </div>


      <button type="submit">Login</button>
    </form>

    <p>Don't have an account? <a href="register.php">Create one</a></p>
  </div>

<script src="js/login.js"></script>


</body>
</html>
