const texts = {

	item: {
		title: 'RESTful App',
		links: {
			github: 'https://github.com/carrn7k/Book-Catalog',
			site: ''
		},
		text: `I had experience building web pages before designing this one, but this was my first real experience putting the 
				backend and frontend together and incorporating an SQL database to build a RESTful app. The backend used Python's Flask
				framework. Prior to this I didn't have a lot of experience working with frameworks, but after getting accustomed to the 
				logic I found it immensely useful. Routing and separating the code into logical chunks became far simpler. Also, managing
				both the server and client was very informative, and it gave me much more insight into the flow and structure of applications, 
				and being able to see under the hood of http requests made me think much more clearly about how to design future applications.
				Lastly, I used my own login system as well as third party authorization via Google and Facebook. It was a struggle to get 
				everything configured correctly, but that struggle taught how to integrate various components to build a modern app.`
	},

	blog: {
		title: 'User Blog',
		links: {
			github: '',
			site: 'http://projecttest-143401.appspot.com/blog'
		},
		text: `This was one of the first apps I built a few years ago. It's a simple user blog built on Google App Enginge. It has a simple
				login system and lets users read and write to a database. This was my introduction to a lot of important concepts: security, 
				routing, error handling, SQL databases, caching, etc. Looking back, the design of the app, both logically and aesthetically, leaves a lot to be
				desired, but it taught me a lot about how web pages are built and the many different components required to make them function smoothly.`
	},

	singlePage: {
		title: 'SPA (Neighborhood Map)',
		links: {
			github: 'https://github.com/carrn7k/neighborhood-map',
			site: 'projects/neighborhood-map/dist/templates/index.html'
		},
		text: `I had a lot of fun building this app, as it gave me a chance to really understand and explore the possibilites that APIs can 
				offer. The app features a location in a particular city and allows users to search for notable attractions around that area that
				are displayed on a Google Map. I used Yelp, TripExpert and Flickr to provide the interactive content. In addition to gaining 
				familiarity with APIs and writing asynchronous requests, I also learned a lot about how to better organize my code. I used Knockout.js as 
				a way to introduce myself to Javascript frameworks. Also, this was my first real experience building a single page application, 
				and it was informative to see how much I could accomplish with the frontend alone.`
	},

	reactFront: {
		title: 'React App (Frontend)',
		links: {
			github: 'https://github.com/carrn7k/smart-brain',
			site: ''
		},
		text: `The app was built by Andrea Neagoie as part of his web developer course. The app has a user registration system and allows validated
				users to use a facial software recogntion API from Clarifai. I had studied React before working on this app, and I had grown to really 
				like its philosophy. The component architecture made setting up, structuring and adding to an application far simpler. However, prior 
				to working on this app I was still new to all the possiblities that the React ecosystem offers. The app uses jwt tokens and Redis for 
				session management. Additionally, the app was set up on Docker, giving me experience working with containers. While the code was 
				written by Andrea Neagoie, I added an API service to make API calls more readable/manageable. 
				`
	},

	reactBack: {
		title: 'React App (Backend)',
		links: {
			github: 'https://github.com/carrn7k/smart-brain-api',
			site: ''
		},
		text: `This app is the backend to the app build on Udemy by Andrea Neagoie. I have less experience working on things from the backend, so 
				this was very useful for giving me more practice in that area. The app is built using express and uses a Knex library to connect the
				app to a Postgres database. I handn't worked much with express prior to this app, so I wasn't very familiar with the concept of middleware.
				However, after getting used to its architecture I found it very intuitive. Handling user sessions and http requests became a much simpler 
				task.`
	 },

	 reactRedux: {
	 	title: 'React/Redux App',
	 	links: {
			github: 'https://carrn7k.github.io/robofriends/',
			site: ''
		},
	 	text: `This app was my first dive into React and Redux. The app itself is quite simple, and it was built on Node using the create-react-app
	 			library. The main purpose of the app is to get accustomed	to the react/redux architecture. At first it took some time to grasp the 
	 			the logic of Redux's action/reducer model, but after getting used to it really helped my ability to think about and design not just React
	 			apps, but it also helped me think about how to better design apps in general--especially with regard to how data should be separated and 
	 			flow throughout the application. Credit for this code also goes to Andrea Neagoie via his course on Udemy.`
	 }, 

	 d3: {
	 	title: 'd3',
	 	links: {
	 		github:'',
	 		site: 'projects/data_dash/index.html',
	 	},
	 	text: `I don't have a lot of experience with d3, but I had a lot of fun building this app as a way to improve my knowledge. The app loads recent
	 	 crime data and then visualizes that data using a histogram and a world map. Formatting the data and integrating it with the 
	 	 visualization and transitions was a bit difficult at first, but I really enjoyed working with the d3 library.`
	 }

}


