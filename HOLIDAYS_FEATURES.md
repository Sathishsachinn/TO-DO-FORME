# Public Holidays & Festivals Feature

## Overview
This update adds comprehensive public holidays and Hindu festivals to the calendar from 2024 to 2030.

## Features Added

### 1. Comprehensive Holiday Database (2024-2030)
- **National Holidays**: Republic Day, Independence Day, Gandhi Jayanti, Ambedkar Jayanti
- **Hindu Festivals**: Holi, Diwali, Janmashtami, Dussehra, Maha Shivaratri, Ram Navami, Vasant Panchami
- **Islamic Festivals**: Eid ul-Fitr, Eid ul-Adha, Muharram, Milad un-Nabi
- **Christian Festivals**: Christmas, Good Friday, Easter
- **Sikh Festivals**: Guru Nanak Jayanti
- **Jain Festivals**: Mahavir Jayanti
- **Buddhist Festivals**: Buddha Purnima

### 2. Religious Symbols on Calendar
Each holiday/festival displays a meaningful symbol:
- 🇮🇳 - National Holidays (India flag)
- 🕉️ - Hindu Festivals (Om symbol)
- ☪️ - Islamic Festivals (Star & Crescent)
- ✝️ - Christian Festivals (Cross)
- ☬ - Sikh & Jain Festivals (Khanda/Swastika)
- ☸ - Buddhist Festivals (Dharma Wheel)

### 3. Interactive Holiday Display
**Hover Tooltip**: Hover over a holiday date to see a tooltip with:
- Festival/Holiday name
- Festival type
- Religious symbol

**Click/Tap Notification**: When you click on a holiday date:
- A toast notification appears showing the festival name and type
- The date is automatically selected for task filtering
- Symbol is displayed prominently

### 4. Visual Styling
- Holiday dates have a special background gradient (purple-tinted)
- Festival name is displayed prominently below the date number
- Responsive design works on desktop, tablets, and mobile devices
- On mobile devices, symbols and names are appropriately sized

## File Changes

### `js/app.js`
- **Lines 28-147**: Added `holidaysDatabase` object containing all holidays/festivals from 2024-2030
- **Lines 1020-1070**: Updated `renderCalendar()` function to:
  - Query holidays for the current month
  - Display holiday symbol and name on calendar cells
  - Show tooltip on hover
  - Display notification when holiday is clicked

### `css/style.css`
- **Lines 183-231**: Added styles for:
  - `.holiday-section`: Container for holiday elements
  - `.holiday-symbol`: Religious symbol styling
  - `.holiday-name`: Festival name styling
  - `.holiday-details`: Tooltip styling
  - `.has-holiday`: Special styling for holiday dates
- **Lines 249-250**: Mobile responsive adjustments

## How to Use

1. **View Holidays**: Navigate through the calendar months. Holidays will automatically display with their symbols and names.

2. **Get Holiday Details**: 
   - **Desktop**: Hover your mouse over a holiday date to see the tooltip
   - **Mobile**: Tap on a holiday date to see the notification

3. **Filter Tasks by Holiday**: Click on a holiday date to select it and see all tasks due on that date.

## Supported Holidays Summary

### 2024
19 holidays/festivals including Holi, Diwali, Christmas, Eid, etc.

### 2025
20 holidays/festivals (current year extended)

### 2026-2030
Comprehensive coverage with ~20+ holidays per year

## Future Enhancements
- Add custom holidays/festivals per user region
- Settings to show/hide specific festival types
- Integration with calendar export (ICS format)
- Recurring holiday notifications
