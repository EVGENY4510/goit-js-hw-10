import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputValue = inputEl.value;
  const name = inputValue.trim();
  if (name === '') {
    clearValue();
    return;
  }

  fetchCountries(name).then(onResolve).catch(error);
}

function onResolve(data) {
  const maxLength = 10;
  if (data.length > maxLength) {
    clearValue();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  data.forEach(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => {
      const params = {};
      params.nameCountri = official;
      params.capitalCountri = capital[0];
      params.populationCountri = population;
      params.flag = svg;
      params.languagesCountri = Object.values(languages).join(',');

      if (data.length === 1) {
        countryInfoEl.innerHTML = ifOne(params);

        return;
      }
      countryListEl.insertAdjacentHTML('beforeend', ifMani(params));
    }
  );
}
function error() {
  clearValue();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
function ifOne(params) {
  countryListEl.innerHTML = '';
  const {
    nameCountri,
    capitalCountri,
    populationCountri,
    flag,
    languagesCountri,
  } = params;
  return ` <div class="countri-head">
        <img src="${flag}" alt="flag"  width="40"/>
        <h1 class="countri-name-one">${nameCountri}</h1>
      </div>
      <ul class="card-list">
        <li class="card-text">Capital:<span class="list-span">${capitalCountri}</span></li>
        <li class="card-text">Population:<span class="list-span">${populationCountri}</span></li>
        <li class="card-text">Languages:<span class="list-span">${languagesCountri}</span></li>
      </ul>`;
}
function ifMani(params) {
  countryInfoEl.innerHTML = '';
  const { flag, nameCountri } = params;
  return `<div class="countri-list-wrapper">
    <li class="countri-flag">
      <img src="${flag}" alt="flag" width="40" />
    </li>
    <li class="countri-name">${nameCountri}</li>
  </div>`;
}
function clearValue() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}