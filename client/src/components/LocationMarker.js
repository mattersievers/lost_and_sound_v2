import React, {useRef, useMemo} from 'react';
import {Marker, Popup, useMap } from 'react-leaflet';

// gets location of user and implements a draggable icon on the map
const LocationMarker = (props) => {
const setPosition =props.setPosition;
const markerRef = useRef()
const map = useMap();

if(!props.locationMarked){
    map.locate().on("locationfound", function (e) {
    props.setPosition(e.latlng);
    map.flyTo(e.latlng, map.getZoom());
    });
    props.setLocationMarked(true);
}

const eventHandlers = useMemo(
    () => ({
        dragend() {
        const marker = markerRef.current
        if (marker != null) {
            setPosition(marker.getLatLng())
        }
        },
    }),
    [setPosition],
    )

return props.position === null ? null : (
    <Marker position={props.position} draggable autoPan eventHandlers={eventHandlers} ref={markerRef}>
    <Popup> 
        The nearest location to where the equipment was lost or your current location.
    </Popup>    
    </Marker>
);
};

export default LocationMarker