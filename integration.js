execute(
  // get metadata
  get(`${state.configuration.dhis2_root_url}/api/metadata.json?assumeTrue=false&dataElements=true&organisationUnits=true&dataSets=true&users=true`, {
    headers: state.configuration.headers,
  },
    state => {
      const dataSetId = state.data.dataSets[0].id;
      const orgUnitIds = state.data.organisationUnits.filter(i => i.hasOwnProperty('parent')).map(i => i.id);
      const orgUnitParams = orgUnitIds.slice(0,2).map(i => `&orgUnit=${i}`).join('');
      state.configuration.dataValueSetsUrl = `${state.configuration.dhis2_root_url}/api/dataValueSets.json?dataSet=${dataSetId}&period=${state.configuration.static_period}`;//${orgUnitParams}`;
      return state;
    }
  ),

  // get datavalues
  get(`${state.configuration.dataValueSetsUrl}`, { headers: state.configuration.headers }, state => {
    const rawOrgUnits = state.references[0].organisationUnits;
    const rawDataElements = state.references[0].dataElements;


    // Create GeoJSON of OrgUnits
    const orgUnitsFeatures = rawOrgUnits.filter(i => i.hasOwnProperty('parent')).map(i => {
      return {
        type: 'Feature',
        properties: {
          id: i.id,
          orgUnit_id: i.id,
          orgUnit_name: i.name,
        },
        geometry: {
          type: 'Point',
          coordinates: i.geometry.coordinates,
        }
      };
    });


    // Create lookup for dataElement renaming
    const dataElementLookup = rawDataElements.reduce((acc, i) => {
      acc[i.id] = i.name;
      acc[i.name] = i.id;
      return acc;
    }, {});


    // Reshape for DiSARM
    const iterate_this = state.data.dataValues;
    iterate_this.forEach((d) => {
      const found_orgUnit = orgUnitsFeatures.find(o => o.properties.orgUnit_id === d.orgUnit);
      if (!found_orgUnit) {
        console.error('Cannot find orgUnit for', d);
        return;
      }
      const found_dataElement = dataElementLookup[d.dataElement];
      if (!found_dataElement) {
        console.error('Cannot find dataElement for', d);
        return;
      }
      const value = Math.parseFloat(d.value);
      found_orgUnit.properties[found_dataElement] = value;
    });

    const orgUnitsGeoJSON = {
      type: 'FeatureCollection',
      features: orgUnitsFeatures,
    };

    state.data.orgUnitsGeoJSON = orgUnitsGeoJSON;
    return state;
  })






  // // post to disarm
  // post(state.configuration.disarm_api_url, {
  //   body: {
  //     headers: state.configuration.headers,
  //     point_data: state.data.orgUnitsGeoJSON
  //   }
  // }, state => {
  //   // state.data will be the response from request
  //   // reshape back from DiSARM for DHIS2
  //   const dataValues = real_run_result.result.features.reduce((acc, f) => {
  //     for (const field_name of ['n_trials', 'n_positive', 'prevalence_prediction']) {
  //       const properties = f.properties;
  //       let dataElement = dataElementLookup[field_name];
  //       const dataElement = dataElementLookup[field_name];
  //       const value = properties[field_name];
  //       const orgUnit = properties.orgUnit_id;
  //       const lastUpdated = new Date;
  //       acc.push({
  //         dataElement,
  //         value,
  //         period: static_period,
  //         orgUnit,
  //         lastUpdated,
  //       })
  //     }
  //     return acc;

  //   }, [])

  //   const data_for_dhis2 = {
  //     dataValues,
  //   };

  //   state.data.data_for_dhis2 = data_for_dhis2;
  //   return state;
  // }),

  // // post to DHIS2
  // post(`${state.configuration.dhis2_root_url}/api/dataValueSets.json?importStrategy=UPDATE`, {
  //   headers: {
  //     ...state.configuration.headers,
  //     'Content-Type': 'application/json',
  //   },
  //   body: state.data.data_for_dhis2
  // },
  //   state => {
  //     return state;
  //   }
  // ),

  // // trigger DHIS2 analytics update
  // post(`${state.configuration.dhis2_root_url}/api/resourceTables/analytics`,
  //   {
  //     headers: state.configuration.headers,
  //   },
  //   state => {
  //     return state;
  //   }
  // )
)


