import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { WeatherData } from './models/weather.model';
import { FormsModule } from '@angular/forms';

type Mode = 'day' | 'night' | 'default' | 'hot-night' | 'clear';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  providers: [WeatherService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private weatherService: WeatherService) { }
  cityName: string = '';
  weatherData?: WeatherData;
  mode: 'day' | 'night' | 'default' = 'default';
  latitude: number = 0;
  longitude: number = 0;
  error: boolean = false;

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getUserLocation();
  }

  onSubmit() {
    console.log('Form submitted with city:', this.cityName);
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }

  private getWeatherData(cityName: string) {
    this.error = false;
    console.log('Fetching weather data for:', cityName);
    this.weatherService.getWeatherData(cityName)
      .subscribe({
        next: (response) => {
          this.weatherData = response;
          console.log('Weather data received:', response);
          this.updateMode();
        },
        error: (err) => {
          console.error('Error fetching weather data:', err);
          this.error = true;
        }
      });
  }

  private getWeatherDataByCoords(lat: number, lon: number) {
    this.error = false;
    console.log('Fetching weather data for coordinates:', lat, lon);
    this.weatherService.getWeatherDataByCoords(lat, lon)
      .subscribe({
        next: (response) => {
          this.weatherData = response;
          console.log('Weather data received:', response);
          this.updateMode();
        },
        error: (err) => {
          console.error('Error fetching weather data:', err);
          this.error = true;
        }
      });
  }
  
  getUserLocation() {
    if (navigator.geolocation) {
      // Show loading indicator
      this.showLoadingIndicator();
  
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('User location:', this.latitude, this.longitude);
        this.getWeatherDataByCoords(this.latitude, this.longitude);
        // Hide loading indicator
        this.hideLoadingIndicator();
      }, (error) => {
        console.error('Error getting location', error);
        // Fallback to a default location if geolocation fails
        this.getWeatherData('Cairo');
        // Hide loading indicator
        this.hideLoadingIndicator();
      }, {
        timeout: 5000, // Set a shorter timeout (in milliseconds)
        maximumAge: 60000 // Allow using cached location up to 1 minute old
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Fallback to a default location if geolocation is not supported
      this.getWeatherData('Cairo');
    }
  }
  
  showLoadingIndicator() {
    // Implement your loading indicator logic here
    console.log('Loading...');
  }
  
  hideLoadingIndicator() {
    // Implement your logic to hide the loading indicator here
    console.log('Loading complete.');
  }
  

  getLocalTime(timezoneOffset: number): Date {
    const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    return new Date(utcTime + timezoneOffset * 1000);
  }

  isNightTime(): boolean {
    if (!this.weatherData) {
      return false;
    }
    const localTime = this.getLocalTime(this.weatherData.timezone);
    const hour = localTime.getHours();
    const isNight = hour >= 18 || hour < 6;
    console.log('isNightTime:', isNight);
    return isNight;
  }

  isHotNight(): boolean {
    return this.isNightTime() && this.weatherData?.main?.temp !== undefined && this.weatherData.main.temp > 30;
  }
  

  isSunnyDay(): boolean {
    return !this.isNightTime() && this.weatherData?.main?.temp !== undefined && this.weatherData.main.temp > 30;
  }

  isSunny(): boolean {
    const isSunny = this.isSunnyDay();
    console.log('isSunny:', isSunny);
    return isSunny;
  }

  isClear(): boolean {
    const isClear = this.weatherData?.main?.temp !== undefined && this.weatherData.main.temp >= 15 && this.weatherData.main.temp <= 30;
    console.log('isClear:', isClear);
    return isClear;
  }

  isCold(): boolean {
    const isCold = this.weatherData?.main?.temp !== undefined && this.weatherData.main.temp < 15;
    console.log('isCold:', isCold);
    return isCold;
  }

  isWindy(): boolean {
    const isWindy = this.weatherData?.wind?.speed !== undefined && this.weatherData.wind.speed > 25;
    console.log('isWindy:', isWindy);
    return isWindy;
  }

  updateMode() {
    if (this.isNightTime()) {
      this.mode = 'night';
    } else if (this.isSunnyDay() || this.isCold() || this.isWindy()) {
      this.mode = 'day';
    } else {
      this.mode = 'default';
    }
    console.log('Mode updated to:', this.mode);
  }
}
