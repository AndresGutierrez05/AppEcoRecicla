import firebase from 'firebase';

let refRequest, refUser;
let firebasedb = null;
export let listObjects = [];
let listRequest = [];
export let statesRequests = [];

export const initFirebase = _ => {
    firebasedb = firebase.initializeApp({
      apiKey: "AIzaSyCIjA_AZukWsbETyOJfbQjumHhR_-mYL_Q",
      authDomain: "appecorecicla.firebaseapp.com",
      databaseURL: "https://appecorecicla.firebaseio.com",
      projectId: "appecorecicla",
      storageBucket: "appecorecicla.appspot.com",
      messagingSenderId: "287016851058"
    });  
    
    refUser = firebasedb.database().ref('/users/');

    refRequest = firebasedb.database().ref('/requests/');

    firebasedb.database().ref('requests').on('value', snapshot => {
      listRequest = snapshot.val();
    });

    firebasedb.database().ref('recyclingObjects').once('value').then(async snapshot => {
      listObjects = snapshot.val();
    });

    firebasedb.database().ref('statesRequests').once('value').then(async snapshot => {
      statesRequests = snapshot.val();
    });
}

export const RegisterUserInDataBase = async userData => {
  let userRegistered;
  let newUser = await getNewIndexFromList(refUser);
  await firebasedb.database().ref(`/users/${newUser}`).set({
    ...userData
    }, function(error) {
        if (error) {
          userRegistered = false;
        } else {
          userRegistered = true;
        }
    });

  return userRegistered;
}

//Consulta de solicitudes realizadas por el usuario - Inicio
export const GetListUserRequests = async (citizenUserId, callback) => {
  await firebasedb.database().ref('requests').on('value', async function(snapshot) {
    let listRequestCitizen = [];
      let values = snapshot.val().map((request, index) => ({ ...request, key : index})).filter(request => request.citizenUserId === citizenUserId);
      for(let i = 0; i <= values.length -1 ; i++ ){
        let infoRecycling = await GetInfoRecycling(values[i].recyclingUserId);
        listRequestCitizen.push({
                ...values[i], 
                recyclingObjects : GetNamesObjects(values[i].recyclingObjects),
                infoRecycling : infoRecycling
                });
      }

    callback(listRequestCitizen);
  });
}
//fin

export const RegisterUserInAuthentication = async (email, password)  => {
  let registerUser = false, response, responseMessage = null;
  try{
    response = await firebase.auth().createUserWithEmailAndPassword(email, password);
    switch(response.operationType){
        case "signIn" :
          registerUser = true;
          responseMessage = "Se ha registrado correctamente, volver a inicio para loguearse";
          break;
        default :
          responseMessage = "Ha ocurrido un problema al registrar, por favor vuelva a intentar";
          break;
    }
  }catch(error){
    var errorCode = error.code;
        switch(errorCode){
            case "auth/email-already-in-use" :
                responseMessage = "El correo suministrado ya se encuentra registrado";
                break;
            case "auth/weak-password" :
                responseMessage = "La contraseña es demasiado debil";
                break;
            default:
                responseMessage = "Ha ocurrido un problema al registrar, por favor vuelva a intentar";
                break;
        }
  }

  return {registerUser : registerUser, responseMessage : responseMessage};
}

export const LoginInAuthentication = async (email, password) => {
   let loginUser = false, response;
   try{
      response = await firebasedb.auth().signInAndRetrieveDataWithEmailAndPassword(email, password);
      switch(response.operationType){
          case "signIn" :
              loginUser = true;
              break;
          default :
              loginUser = false;
              break;
      }
   }catch(error){
      loginUser = false;
   }
   return loginUser;
}

export const RegisterRequest = async requestData => {
  let requestRegistered;
  let newIndex = await getNewIndexFromList(refRequest);
    await firebasedb.database().ref(`/requests/${listRequest.length === 0 ? 0 :newIndex}`).set({
      ...requestData
    }, function(error) {
        if (error) {
          requestRegistered = false;
        } else {
          requestRegistered = true;
        }
    });

  return requestRegistered;
}

export const GetUserInDatabase = async (email, callback) => {
  await firebasedb.database().ref('users').once('value', function(snapshot) {
    callback(snapshot.val().map((user, index) => ({...user, key : index})).filter(user => user.email === email)[0]);
  });
}

export const GetListRequestsOnHold = async callback => {
  await firebasedb.database().ref('requests').on('value', function(snapshot) {
    callback(snapshot.val().map((request, index) => ({ ...request, key : index})).filter(request => request.stateRequest === 1).map(request => ({...request , recyclingObjects : GetNamesObjects(request.recyclingObjects)})));
  });
}

export const GetListRequestsOnHoldByCitizenUser = async (citizenUserId, callback) => {
  await firebasedb.database().ref('requests').on('value', function(snapshot) {
    callback(snapshot.val().map((request, index) => ({ ...request, key : index})).filter(request => request.citizenUserId === citizenUserId && request.stateRequest === 1));
  });
}

const GetNamesObjects = listObjectSelected => {
  return listObjects.filter(object => listObjectSelected.includes(object.recyclingObjectId)).map(object => object.name);
}

async function getNewIndexFromList(ref) {
  let index;
  await ref.limitToLast(1).once('child_added').then(function(snapshot){
    index = parseInt(snapshot.key) + 1
  }).catch(function(error) {
    index = 0
  });
  return index;
}

export const GetListRequestsAssignedByRecyclingUser = async (recyclingUserId, callback) => {
  await firebasedb.database().ref('requests').on('value', async function(snapshot) {
      let listRequestAssigned = [];
      let values = snapshot.val().map((request, index) => ({ ...request, key : index})).filter(request => request.recyclingUserId === recyclingUserId);
      for(let i = 0; i <= values.length -1 ; i++ ){
        let infoCitizen = await GetInfoCitizen(values[i].citizenUserId);
        listRequestAssigned.push({
                ...values[i], 
                recyclingObjects : GetNamesObjects(values[i].recyclingObjects),
                infoCitizen : infoCitizen
                });
      // });
      }
      // values.forEach(async request => {
       
      callback(listRequestAssigned);
  });
}

const GetInfoCitizen = async citizenUserId => {
  let infoCitizenUser;
  await firebasedb.database().ref(`users/${citizenUserId}`).once('value', function(snapshot) {
    infoCitizenUser = snapshot.val()
  });
  return infoCitizenUser;
}

const GetInfoRecycling = async recyclingUserId => {
  let infoRecyclingUser;
  await firebasedb.database().ref(`users/${recyclingUserId}`).once('value', function(snapshot) {
    infoRecyclingUser = snapshot.val()
  });
  return infoRecyclingUser;
}

export const assignRequest = (requestId, recyclingUserId) => {
  let updates = {};
  updates[`/${requestId}/recyclingUserId`] = recyclingUserId;
  updates[`/${requestId}/stateRequest`] = 2;
  return firebasedb.database().ref('requests').update(updates);
} 

export const updateStateRequest = (requestId, newStateRequest) => {
  let update = {};
  update[`/${requestId}/stateRequest`] = newStateRequest;
  return firebasedb.database().ref('requests').update(update);
}