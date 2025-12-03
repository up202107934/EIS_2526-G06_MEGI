<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account</title>
  <link rel="stylesheet" href="css/login_register.css">
</head>
<body class="auth-page register-page">

  <div class="login-container">
    <h1>Create Account</h1>
    <form id="register-form" action="#" method="post" enctype="multipart/form-data">
    
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" required />
        <small></small>
      </div>

      <div class="form-group">
        <label for="date_of_birth">Date of Birth</label>
        <input type="date" id="date_of_birth" name="date_of_birth" required />
        <small></small>
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required />
        <small></small>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
        <small></small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input type="password" id="password" name="password" required>
          <button type="button" class="toggle-password" data-target="password">👁️</button>
        </div>
        <div id="password-strength">
          <div id="strength-bar"></div>
        </div>
        <small></small>
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <div class="password-wrapper">
          <input type="password" id="confirm-password" name="confirm-password" required />
          <button type="button" class="toggle-password" data-target="confirm-password">👁️</button>
        </div>
        <small></small>
      </div>

      <div class="form-group">
          <label for="profile_img">Profile Image (Optional)</label>
          <input type="file" id="profile_img" name="profile_img" accept="image/*">
      </div>

      <button type="submit">Create Account</button>
    </form>

    <p>Already have an account? <a href="login.php">Login</a></p>
  </div>

  <script src="js/register.js"></script>

</body>
</html>