import React, { Component, Fragment  } from 'react';

import GoogleMapReact from 'google-map-react';

import styled from 'styled-components';

import AutoComplete from './Autocomplete';
import Marker from './Marker';
import credentials from './credentials';
import { connect } from "react-redux"
import {addMarker} from '../actions/markerAction'

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class MyGoogleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapApiLoaded: false,
            mapInstance: null,
            mapApi: null,
            geoCoder: null,
            places: [],
            center: [],
            zoom: 9,
            address: '',
            draggable: true,
            lat: null,
            lng: null,
            //marks: []
        };
    }
    componentWillMount() {
        this.setCurrentLocation();
    }


    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
    }
    onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        this._generateAddress();
    }

    _onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });

    }

    _onClick = (value) => {
        this.setState({
            lat: value.lat,
            lng: value.lng,
        });
    }

     apiHasLoaded = (map, maps) => {
         this.setState({
             mapApiLoaded: true,
             mapInstance: map,
             mapApi: maps,
         });

         this._generateAddress();
     };

    addPlace = (place) => {
        const marker = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), text: place.formatted_address}
        this.props.addMarker(marker)
        this.setState({
            places: [place],
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            //marks: [...this.state.marks, {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), text: place.formatted_address}]
        });
        this._generateAddress()
    };

     _generateAddress() {
         const {
             mapApi
         } = this.state;

         const geocoder = new mapApi.Geocoder;

         geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {

             if (status === 'OK') {
                 if (results[0]) {
                     this.zoom = 12;
                     this.setState({ address: results[0].formatted_address });
                 } else {
                     window.alert('No results found');
                 }
             } else {
                 window.alert('Geocoder failed due to: ' + status);
             }

         });
     }

    // Get Current Location Coordinates
    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }

    render() {
        const {
            places, mapApiLoaded, mapInstance, mapApi,
        } = this.state;
        console.log("AAAAAAAAAA",this.props)
        const { marks } = this.props.marks;

        return (
            <Wrapper>
                {mapApiLoaded && (
                    <div>
                        <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
                    </div>
                )}
                <GoogleMapReact
                    center={this.state.center}
                    zoom={this.state.zoom}
                    draggable={this.state.draggable}
                    onChange={this._onChange}
                    onChildMouseDown={this.onMarkerInteraction}
                    onChildMouseUp={this.onMarkerInteractionMouseUp}
                    onChildMouseMove={this.onMarkerInteraction}
                    onChildClick={() => console.log('child click')}
                    onClick={this._onClick}
                    bootstrapURLKeys={{
                        key: credentials.mapsKey,
                        libraries: ['places', 'geometry'],
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                >
                    {marks.map((mark, index) =>
                    {
                        return(
                            // <Fragment key={index}>
                                <Marker key = {index}
                                        text={mark.text}
                                        lat={mark.lat}
                                        lng={mark.lng}/>
                            // </Fragment>
                        )
                    })}


                </GoogleMapReact>

                <div className="info-wrapper">
                    <div className="map-details">Latitude: <span>{this.state.lat}</span>, Longitude: <span>{this.state.lng}</span></div>
                </div>


            </Wrapper >
        );
    }
}
const mapStateToProps = state => ({
    marks: state.marks,
  })
//export default MyGoogleMap;
export default connect(mapStateToProps, {addMarker})(MyGoogleMap)