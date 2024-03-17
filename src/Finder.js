import React, { useState } from "react";
import data from "./data.json";
import "./Finder.css";

function Finder() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundElement, setFoundElement] = useState(null);

  // Spracovanie udalostí pre výber regiónu, kraja, mesta a okresu
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setSelectedSubdistrict(null);
    setFoundElement(null);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedCity(null);
    setSelectedSubdistrict(null);
    setFoundElement(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedSubdistrict(null);
    setFoundElement(null);
  };

  const handleSubdistrictSelect = (subdistrict) => {
    setSelectedSubdistrict(subdistrict);
    setFoundElement(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.trim());
    setFoundElement(null);
  };

  const handleSearch = () => {
    if (searchQuery === "") {
      resetSelection();
    } else {
      openListsForSearch(searchQuery);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setSelectedSubdistrict(null);
  };

  // Otvorenie zoznamov pre nájdené položky vyhľadávania
  const openListsForSearch = (query) => {
    const elements = findElements(query);
    if (elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      switch (lastElement.type) {
        case "region":
          setSelectedRegion(lastElement.region);
          setSelectedDistrict(null);
          setSelectedCity(null);
          setSelectedSubdistrict(null);
          break;
        case "district":
          setSelectedRegion(lastElement.region);
          setSelectedDistrict(lastElement.district);
          setSelectedCity(null);
          setSelectedSubdistrict(null);
          break;
        case "city":
          setSelectedRegion(lastElement.region);
          setSelectedDistrict(lastElement.district);
          setSelectedCity(lastElement.city);
          setSelectedSubdistrict(null);
          break;
        case "subdistrict":
          setSelectedRegion(lastElement.region);
          setSelectedDistrict(lastElement.district);
          setSelectedCity(lastElement.city);
          setSelectedSubdistrict(lastElement.subdistrict);
          break;
        default:
          break;
      }
      setFoundElement(lastElement);
    } else {
      resetSelection();
    }
  };

  // Nájdenie položiek zodpovedajúcich vyhľadávacej požiadavke
  const findElements = (query) => {
    const matches = [];
    const lowercaseQuery = query.toLowerCase().trim();

    data.regions.forEach((region) => {
      if (region.name.toLowerCase().includes(lowercaseQuery)) {
        matches.push({ type: "region", region: region });
      }
      region.districts.forEach((district) => {
        if (district.name.toLowerCase().includes(lowercaseQuery)) {
          matches.push({
            type: "district",
            region: region,
            district: district,
          });
        }
        district.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(lowercaseQuery)) {
            matches.push({
              type: "city",
              region: region,
              district: district,
              city: city,
            });
          }
          city.districts.forEach((subdistrict) => {
            if (subdistrict.name.toLowerCase().includes(lowercaseQuery)) {
              matches.push({
                type: "subdistrict",
                region: region,
                district: district,
                city: city,
                subdistrict: subdistrict,
              });
            }
          });
        });
      });
    });

    return matches;
  };

  // Zobrazenie aktuálnej cesty k vybraným položkám
  const renderPath = () => {
    let path = "";
    if (selectedRegion) path += selectedRegion.name;
    if (selectedDistrict) path += ` / ${selectedDistrict.name}`;
    if (selectedCity) path += ` / ${selectedCity.name}`;
    if (selectedSubdistrict) path += ` / ${selectedSubdistrict.name}`;
    return path;
  };

  return (
    <div className="layout">
      <div className="filter">
        <div>
          <div>
            <input
              type="text"
              placeholder="Zadajte názov"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>Hľadať</button>
            <button onClick={resetSearch}>Reset</button>
          </div>

          <div className="path">{renderPath()}</div>
        </div>
      </div>
      <div className="Finder">
        <div className="column">
          {/* <h3>Časť:</h3> */}
          <ul>
            {data.regions.map((region) => (
              <li
                key={region.id}
                className={selectedRegion === region ? "selected" : ""}
                onDoubleClick={() => handleRegionSelect(region)}
                style={{ cursor: "pointer" }}
              >
                {region.name}
              </li>
            ))}
          </ul>
        </div>

        {selectedRegion && (
          <div className="column">
            {/* <h3>Kraj:</h3> */}
            <ul>
              {selectedRegion.districts &&
                selectedRegion.districts.map((district) => (
                  <li
                    key={district.id}
                    className={
                      selectedDistrict === district || foundElement === district
                        ? "selected"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => handleDistrictSelect(district)}
                  >
                    {district.name}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {selectedDistrict && (
          <div className="column">
            {/* <h3>Sídlo:</h3> */}
            <ul>
              {selectedDistrict.cities &&
                selectedDistrict.cities.map((city) => (
                  <li
                    key={city.id}
                    className={
                      selectedCity === city || foundElement === city
                        ? "selected"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {selectedCity && (
          <div className="column">
            {/* <h3>Městská část:</h3> */}
            <ul>
              {selectedCity.districts &&
                selectedCity.districts.map((subdistrict) => (
                  <li
                    key={subdistrict.id}
                    className={
                      selectedSubdistrict === subdistrict ||
                      foundElement === subdistrict
                        ? "selected"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => handleSubdistrictSelect(subdistrict)}
                  >
                    {subdistrict.name}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Finder;
