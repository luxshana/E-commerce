"use client";

import React, { useEffect, useRef, useCallback } from "react";

// Move PARIS_LOCATION outside the component for stability
const PARIS_LOCATION = { lat: 48.8566, lng: 2.3522 };

// Move calculateDistanceFromParis outside the component for stability
const calculateDistanceFromParis = (destination, parisLocation) => {
  const { lat: lat1, lng: lng1 } = parisLocation;
  const { lat: lat2, lng: lng2 } = destination;

  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // in km
};

// Move initAutocomplete outside the component for stability
const initAutocomplete = (autocompleteRef, setError, handlePlaceSelect) => {
  if (autocompleteRef.current) {
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"],
          fields: ["address_components", "formatted_address", "geometry"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          setError("Please select a valid address from the suggestions.");
          return;
        }
        handlePlaceSelect(place);
      });
    } catch (error) {
      setError("Failed to initialize address autocomplete.");
      console.error("Autocomplete initialization error:", error);
    }
  }
};

export default function ShippingAddressAutocomplete({
  formData,
  setFormData,
  setError,
  calculateTotalPrice,
  cart,
}) {
  const autocompleteRef = useRef(null);

  // Memoize handlePlaceSelect
  const handlePlaceSelect = useCallback(
    (place) => {
      const addressComponents = place.address_components || [];
      let streetNumber = "";
      let road = "";
      let city = "";
      let pincode = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        }
        if (types.includes("route")) {
          road = component.long_name;
        }
        if (types.includes("locality") || types.includes("postal_town")) {
          city = component.long_name;
        }
        if (types.includes("postal_code")) {
          pincode = component.long_name;
        }
      });

      const distance = place.geometry
        ? calculateDistanceFromParis(
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            PARIS_LOCATION
          )
        : null;

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          shipping_address: place.formatted_address || "",
          street_number: streetNumber,
          road: road,
          delivery_city: city,
          delivery_pincode: pincode,
          distance_value:
            distance !== null
              ? Number(distance.toFixed(1))
              : prev.distance_value || 0,
        };
        return newFormData;
      });
      setError(null);

      if (distance !== null) {
        calculateTotalPrice(
          cart,
          formData.use_points,
          Number(distance.toFixed(1))
        );
      }
    },
    [cart, calculateTotalPrice, formData.use_points, setError, setFormData]
  );

  useEffect(() => {
    let script;
    if (!window.google) {
      script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => {
        initAutocomplete(autocompleteRef, setError, handlePlaceSelect);
      };
      script.onerror = () => {
        setError("Failed to load Google Maps API.");
      };
      document.head.appendChild(script);
    } else if (
      window.google &&
      window.google.maps &&
      window.google.maps.geometry
    ) {
      initAutocomplete(autocompleteRef, setError, handlePlaceSelect);
    } else {
      setError("Google Maps Geometry library not loaded.");
    }

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [setError, handlePlaceSelect]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK" && results[0]) {
            const place = results[0];
            handlePlaceSelect(place);
          } else {
            setError("Unable to retrieve your address from your location.");
          }
        });
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, shipping_address: e.target.value });
  };

  return (
    <div className="ck_fields_grp">
      <div className="form-group">
        <label htmlFor="shipping_address">Shipping Address</label>
        <input
          type="text"
          id="shipping_address"
          name="shipping_address"
          value={formData.shipping_address}
          onChange={handleChange}
          placeholder="Enter your address"
          ref={autocompleteRef}
          autoComplete="off"
          className="form-control"
        />
      </div>
      <button
        type="button"
        onClick={handleGetLocation}
        className="btn btn-secondary mt-2"
      >
        Use Current Location
      </button>
    </div>
  );
}
