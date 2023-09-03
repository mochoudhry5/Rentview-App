import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


function SearchRentalView() {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2}
      listViewDisplayed={false} 
      fetchDetails={true}
      query={{
          key: 'YOUR_API_KEY_HERE',
          language: 'en'
      }}
      nearbyPlacesAPI='GooglePlacesSearch'
      debounce={300}
  />
  )
}

export default SearchRentalView