import React from "react"
import { mapStyles } from './styled-component'
import { compose, withProps, withHandlers } from "recompose"
import MarkerIcon from '../../assets/icon/map_icon.png'
import SelectedMarkerIcon from '../../assets/icon/Map-icon-selected.png'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, withStateHandlers, InfoWindow } from "react-google-maps";
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapModule = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCHZV-ToxlUuJbLbuMNb7NrWhZYTgfT0L8",
        loadingElement: <div style={{ height: "100%" }} />,
        containerElement: <div style={{ height: "320px" }} />,
        mapElement: <div style={{ height: "100%" }} />
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
        },
    }),
    withScriptjs,
    withGoogleMap
)(props => {
    if (!props.lat) {
        return (
            <GoogleMap ref={props.onMapLoad} onClick={props.onMapClick} defaultOptions={{ styles: mapStyles }} defaultZoom={1} center={{ lat: 23.6260333, lng: -102.5375005 }}>
                <MarkerClusterer
                    onClick={props.onMarkerClustererClick}
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}
                >
                    {props.markers.map((marker, i) => (
                        <Marker key={i} icon={MarkerIcon} key={i} position={{ lat: marker.latitude, lng: marker.longitude }} title={marker.site_name} />))}
                </MarkerClusterer>
            </GoogleMap>
        )
    } else {
        var latit = props.lat;
        var longit = props.lng;
        return (
            <GoogleMap ref={props.onMapLoad} onClick={props.onMapClick} defaultOptions={{ styles: mapStyles }} zoom={14} center={{ lat: latit, lng: longit }}>
                <Marker icon={SelectedMarkerIcon} position={{ lat: latit, lng: longit }} />
            </GoogleMap>
        )
    }
})
export default MapModule;