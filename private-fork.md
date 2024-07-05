The [repository](https://github.com/codeyarduk/auth-messiah) for the auth-messiah is public and Github does not allow the creation of private forks for public repositories.

 1. Create a bare clone of the repository.
    (This is temporary and will be removed so just do it wherever.)
    ```bash
    git clone --bare git@github.com:codeyarduk/auth-messiah.git
    ```
 2. Mirror-push your bare clone to your new `auth-messiah` repository.
    > Replace `<your_username>` with your actual Github username in the url below.
    
    ```bash
    cd easytrace.git
    git push --mirror git@github.com:<your_username>/auth-messiah.git
    ```

 3. Remove the temporary local repository you created in step 1.
    ```bash
    cd ..
    rm -rf auth-messiah.git
    ```
    
 4. You can now clone your `auth-messiah` repository on your machine (in my case in the `code` folder).
    ```bash
    cd ~/code
    git clone git@github.com:<your_username>/auth-messiah.git
    ```
   
 5. If you want, add the original repo as remote to fetch (potential) future changes.
    Make sure you also disable push on the remote (as you are not allowed to push to it anyway).
    ```bash
    git remote add upstream git@github.com:codeyarduk/auth-messiah.git
    git remote set-url --push upstream DISABLE
    ```
    You can list all your remotes with `git remote -v`. You should see:
    ```
    origin	git@github.com:<your_username>/auth-messiah.git (fetch)
    origin	git@github.com:<your_username>/auth-messiah.git (push)
    upstream	git@github.com:codeyarduk/auth-messiah.git (fetch)
    upstream	DISABLE (push)
    ```
    > When you push, do so on `origin` with `git push origin`.
   
    > When you want to pull changes from `upstream` you can just fetch the remote and rebase on top of your work.
    ```bash
      git fetch upstream
      git rebase upstream/main
      ```
      And solve the conflicts if any

 
