<b> Note : We have removed the credentials.json file as it contained our google authentication key. For running this code , you need to create your own google auth credentials. </b>
<br><br>
<b>For executing this project on your local host , follow these steps => </b>
(Before contibuting to this project, make sure to execute this project on your local host in order to see the results)
1) Download this project
2) make sure python is installed in your PC.
3) Also ensure that django and all other libraries are installed in your python. If not then run the below commands in your command prompt after installing python.
4) In command prompty , go in this project directory and execute "python manage.py runserver" without quotation marks. (Suppose your project is in xyz folder in D drive then write cd D: and then write cd: D:/xyz in next line after pressing enter to go in xyz directory)
5) Go to "http://127.0.0.1:8000/" and your project is deployed on your local host. Dont close the command prompt while the project is running
6) For stopping this project , just close the command prompt.

   Commands to install all the required libraries (just copy paste them as it is your command prompt)

   pip install django <br>
   pip install json <br>
   pip install requests <br>
   pip install pymongo <br>
   pip install scikit-learn <br>

   To run your Django and Streamlit projects on two different ports, follow these steps:

In the first terminal, run Django on port 8000:
python manage.py runserver 8000

In the second terminal, run Streamlit on port 8501:
streamlit run app.py --server.port 8501
Now, Django will be accessible at http://127.0.0.1:8000/ and Streamlit at http://localhost:8501/.
streamlit will be embedded in main project
   
  

   
   
