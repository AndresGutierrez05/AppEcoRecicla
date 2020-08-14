import React, { Component } from 'react';
import { message } from 'antd';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const apiKey = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDDxqCkVkt6Trii_vBNaRDFDl98kXG5w9M&v=3.exp&libraries=geometry,drawing,places"
export let Localizacion = null;

export const MapWithASearchBox = compose(
  withProps({
    googleMapURL: apiKey,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentDidMount() {
      const refs = {}
      this.setState({
        bounds: null,
        center: {
          lat: 4.64, lng: -74.08
        },
        markers: [],
        direction : "",
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onDragEnd : e => {
          let geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({'location': {lat : e.latLng.lat(), lng : e.latLng.lng()}}, function(results, status) {
                      if (status == 'OK') {
                        let resultado = results[0]
                         Localizacion = {
                            LatLng : {
                                Latitud : resultado.geometry.location.lat(),
                                Longitud : resultado.geometry.location.lng()
                            },
                            Direccion : resultado.formatted_address
                         }
                         document.getElementById("cajaBusquedaMaps").value = resultado.formatted_address
                      } else {
                          message.warning("Lugar no encontrado");
                      }
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => {
            
            this.setState({ direction : place.formatted_address });

            return {
              position: place.geometry.location,
            }
          });
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });

          Localizacion = { LatLng : { Latitud : this.state.markers[0].position.lat()
                          , Longitud : this.state.markers[0].position.lng()}, Direccion : this.state.direction }

          refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={1}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        className="direccion-caja-busqueda"
        type="text"
        id="cajaBusquedaMaps"
        placeholder="Buscar direccion"
        style={{
          border: `1px solid transparent`,
          height: `32px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.length > 0 ?
      <Marker 
          draggable={true} 
          key={1} 
          position={props.markers[0].position} 
          onDragEnd={props.onDragEnd}/>
    : ""}
  </GoogleMap>
)

export const MapWithAMarkerWithLabel = compose(
  withProps({
    googleMapURL: apiKey,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `270px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  // lifecycle({
  //   componentDidMount(){
  //     this.setState({
  //       onBoundsChanged : (lat, lng) => {
  //         this.setState({ center : { lat : lat, lng : lng} });
  //       },
  //     })
  //   }
  // }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    defaultZoom={20}
    center={{ lat: props.lat, lng: props.lng }}
    // onBoundsChanged={() => props.onBoundsChanged(props.lat, props.lng)}
  >
    <MarkerWithLabel
      position={{ lat: props.lat, lng: props.lng }}
      labelAnchor={new window.google.maps.Point(0, 0)}
      labelStyle={{backgroundColor: "#F2F2F2", fontSize: "12px", padding: "16px", borderRadius: "5px" , border : "1px dotted"}}
    >
      <div>{props.direction}</div>
    </MarkerWithLabel>
  </GoogleMap>
);
  
