Harlequin-Hedgehogs Final Project &ndash; A blogging system
==========

This is the final project completed by the team Harlequin-Hedgehogs: a working blogging website that allows any user to view available articles posted by registered users, or for registered users to create and post articles, add comment, update their details (among other things).

## Our blog is live!
For demo purposes only, our blog can be viewed from this website:
https://harlequin-hedgehogs-blog.herokuapp.com/
Please note that some functionalities (example, saving comments, and fetching the number of comments, refreshing the information) due to Heroku not supporting SQLite as a production database.


## The team
We are team Harlequin Hedgehogs:
- Jeanne Cang
- Simi Joseph
- Tamiru Hairu (Team Leader)
- Xinhao Liu


## Features:

All the compulsory features have been implemented in this project: 

1. Users must be able to create new accounts. Each new user should be able to choose a username (which must be unique) and a password. At minimum, a user’s real name and date of birth should also be recorded, along with a brief description about themselves.

2. When selecting a username while creating an account, users should be immediately informed if the given username is already taken. Users should not have to submit a form to discover whether their chosen username is taken (i.e. you should use fetch() or similar to implement this feature).

3. When selecting a password while creating an account, users should be presented with two password textboxes (e.g. “Choose password”, and “re-enter password”). They must type the same password in each box in order to proceed. If the user didn’t enter the same password in both textboxes, they should not be allowed to submit the form.

4. When creating an account, users must be able to choose from amongst a set of predefined “avatar” icons to represent themselves. (Note: upon account creation, a user is assigned a default avatar, but user can update this and select from pre-defined avatars.)

5. Once a user has created an account, they must be able to log in and log out.

6. Research: Passwords should not be stored in plaintext in the database. Investigate the use of password hashing and salting. The bcrypt npm package may be of use here, but you’re free to solve this problem in any way you choose.

7. Users must be able to browse a list of all articles, regardless of whether they are logged in or not. If logged in, they should additionally be able to browse a list of their own articles.

8. When logged in, users must be able to add new articles, and edit or delete existing articles which they have authored.

9. Research: When authoring articles, a text editor with WYSIWYG (What You See Is What You Get) support should be provided. Images should be able to be placed within articles at any point, and should ideally be stored as files on the server. The documentation for your WYSIWYG component of choice should be able to help with this. We recommend TinyMCE, but you may choose an alternative if you wish. (Note: TinyMCE is used in this project.)

10. Users must be able to edit any of their account information, and also be able to delete their account. If a user deletes their account, all of their articles
should also be deleted.

11. The website must have a consistent look and feel, and must be responsive.


## Extra Features:

We have also added these extra features: 

1. Users can upload their own avatar/image. 

2. An email notification feature. Emails are formatted and there are links available in the content that user can click on to be redirected to the blog site. Emails are sent when:
    - User signs up
    - User subsribes to one or more categories
    - A new article is posted. User will receive an email when a new article is published for the category that the user has subscribed to.
Emails are sent to valid accounts.

3. A subscription feature. Users (general or registered) can subscribe to the blog by providing an email address and selecting one or more categories. Once subscribed, user is  alerted via email whenever a new article for selected category or categories are published. User can also unsubscribe from the link provided in the email, and when unsubscribed, will no longer receive emails for new articles published.

3. When creating articles, user will select a category: General, Technology, Business, Travel, Culture. 

4. User can view articles for a particular category by selecting a specific category link (from the Navbar). The home page displays all the articles (all categories).

5. The latest published article is displayed in the sidebar section of the page (under "Recent Post"), that shows the title and short preview of the article content.  

6. Search function is available for general and registered (logged in) users. User can search by keyword, and articles containing this keyword are displayed. If there are no results matching, then it will display that no articles match the keyword.

7. Articles have a comment counter where the number of comments are displayed. Only logged in users can view the comments.

8. Only a registered and logged in user can post a Comment on an article. Only the user who created the comment can edit (update) or delete it.

9. User can reset password. Old password is checked against the database that it is the current password for the logged in user. When creating a new password, user will enter a new password and confirm new password - the new password and re-entered password are checked that they match.

10. When clicking on the author name (link) from the article, it will display the user description "About the Author" in the sidebar.



## Instructions and notes to marker: 

1. Instructions on what the database file (*.db file) should be named:
    - Create a new database named project-database.db
    - Run the scripts found in /sql/project-database-init-script.sql to load initial data (users, articles, comments)

2. Username / password combination for an existing users with some already-published articles:
    - username: admin, password: pa55word
    - username: user1, password: pa55word
    - username: user2, password: pa55word

3. Does the marker need to do anything prior to running your webapp, other than npm install?
   - Create a folder under the main project named "config". Under config folder manually copy the "dev.env". This contains the private keys config, which are sent to Andrew separately via Slack. Please let us know if not received and we can resend the file. We are unable to include this in the Git repository as it suspends our SendGrid account (used for the email notifications) when the private keys are exposed publicly.

4. Any other instructions / comments you wish to make to your markers.
    - When adding text (creating articles and comments), please do not copy and paste directly from a link or website (better to enter it manually on the fields/text area or remove any formatting). This seems to cause an error with SQLite when inserting the data.
    - Use a valid email address when signing up or subscribing in order to view the email contents. Make sure to click "download all images" in your email message to display/view the page formatting properly. If you do not see the email, please check your "Junk Email" folder.
