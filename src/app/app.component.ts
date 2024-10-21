import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { WeatherData } from './models/weather.model';
import { FormsModule } from '@angular/forms';

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
  cityName: string = 'Cairo';
  weatherData?: WeatherData;
  mode: 'day' | 'night' | 'default' = 'default';

  ngOnInit(): void {
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }

  onSubmit() {
    console.log('Form submitted with city:', this.cityName);
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }

  private getWeatherData(cityName: string) {
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
        }
      });
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