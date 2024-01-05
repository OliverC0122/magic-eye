import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank"; 
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';

// This function returns the request options for the Clarifai API
const returnClarifaiJSONRequest = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'a293b1da5a3a4e67a2636069fdea6ba7';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';
    const APP_ID = 'main';  

    // setup the Json request
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": imageUrl
                      // "base64": IMAGE_BYTES_STRING
                  }
              }
          }
      ]    
  });
  
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
}


class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn : false
    }
  }

  // This is a function that will be passed down to the ImageLinkForm component
  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    console.log(clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height, 
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onButtonSubmit = () => {

    this.setState({imageUrl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiJSONRequest(this.state.input))
    .then(response => response.json())
    .then(result => {
      
      console.log(result);
      console.log(this.calculateFaceLocation(result));
      this.displayFaceBox(this.calculateFaceLocation(result));

      console.log(this.state.box)
    })
    .catch(error => console.log('error', error));

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

    render = () => {
      return (
        <div className="App">
        
        <ParticlesBg type="cobweb" bg={true} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          <Logo/>
          {this.state.route === 'home'
          ? 
          <div>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div> 
          :
          ( this.state.route === 'signin' ?       
           <SignIn onRouteChange={this.onRouteChange}/> 
            :
            <Register onRouteChange={this.onRouteChange}/>
          )

          
          }
        </div>
      );
      }
}

export default App;
