<script lang="ts">

</script>

<div>
<div class="hero bg-base-200 mt-4">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Login/Register</h1>
      <p class="py-6">
        Login to access your wishlists. Register to start building your lists.
        All you need is a username and password.        
      </p>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div class="card-body">
        <fieldset class="fieldset">
          <form action="?/login" method="post">
            <label class="label" for="email">Username</label>
            <input type="email" class="input" id="email" placeholder="Email" />
            <label class="label mt-2" for="pw">Password</label>
            <input id="pw" type="password" class="input" placeholder="Password" />
            <div class="mt-2">
              <a class="link link-hover" href="/help">
                Forgot password?
              </a>
            </div>
            <div class="flex mt-2 space-x-4">
              <button class="btn btn-neutral">Login</button>
              <button class="btn" formaction="?/register">Register</button>
            </div> 
          </form>
        </fieldset>
      </div>
    </div>
  </div>
</div>
</div>
