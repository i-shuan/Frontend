import React, { useState, useEffect } from "react";
import { DatePicker, ConfigProvider, Select } from "antd";
import enUS from "antd/lib/locale/en_US";
import { utcToZonedTime, format , getTimezoneOffset  } from 'date-fns-tz';
import { parse, parseISO ,  } from "date-fns";

const { RangePicker } = DatePicker;

const timeZones = {
    'Etc/UTC': { abbreviation: 'UTC', offset: 0 },
    'America/Phoenix': { abbreviation: 'AZ', offset: +7 },
    'Asia/Taipei': { abbreviation: 'TW', offset: -8 },
    // Add more timezones here as needed
  };

const dateTime = [
    "03/04/2023 12:00:00 AM UTC",
    "03/04/2023 11:09:01 PM AZ",
    "03/05/2023 10:09:01 AM TW",
    "05/06/2003 05:32:01 PM AZ",
    "08/22/2015 11:23:47 PM TW",
    "04/15/2017 04:22:37 AM AZ",
    "07/18/2012 09:51:21 PM UTC",
    "07/02/2019 01:17:33 PM AZ",
    "08/09/2011 06:57:08 AM UTC",
    "07/18/2004 03:13:39 PM TW",
    "08/05/2008 05:45:28 AM UTC",
    "01/22/2009 10:34:42 AM TW",
    "06/21/2017 11:01:36 PM AZ",
    "03/13/2015 06:27:11 AM TW",
    "10/12/2016 02:03:49 PM TW",
    "01/19/2006 08:51:57 PM AZ",
    "06/10/2013 01:11:39 PM UTC",
    "01/08/2001 10:33:15 PM TW",
    "09/20/2006 06:28:22 AM AZ",
    "09/16/2020 11:16:48 PM TW",
];

const Footer = ({ setSelectedTimezone }) => {
    const handleDropdownVisibleChange = (open) => {
      // Do nothing, just prevent the RangePicker panel from closing
    };
  
    const handleChange = (timezone) => {
      setSelectedTimezone(timezone);
    };
  
    return (
      <Select
        defaultValue="UTC"
        style={{ width: 120 }}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        onChange={handleChange}
      >
        {Object.entries(timeZones).map(([timezoneValue, timezone]) => (
          <Select.Option key={timezoneValue} value={timezoneValue}>
            {timezone.abbreviation}
          </Select.Option>
        ))}
      </Select>
    );
  };

const DateTimeRangeFilter = () => {
  const [selectedTimezone, setSelectedTimezone] = useState("Etc/UTC");
  const [panelOpen, setPanelOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [filteredDates, setFilteredDates] = useState([]);

    const onChange = (dates, dateStrings) => {
        console.log("dates", dateStrings);
        if (dates) {
            console.log("selectedTimezone", selectedTimezone)
            const startUTC = getDateInTimezone(dateStrings[0], selectedTimezone);
            const endUTC = getDateInTimezone(dateStrings[1], selectedTimezone);
            console.log("startDate: ", startUTC);
            console.log("endDate: ", endUTC);
        }
    };

    const getDateInTimezone = (dateString, timeZoneValue) => {
        const timeZone = timeZones[timeZoneValue];
        if (!timeZone) {
          throw new Error(`Invalid timezone value: ${timeZoneValue}`);
        }
      
        const parsedDate = parse(dateString, "MM/dd/yyyy HH:mm:ss", {
          timeZone: "Etc/UTC",
        });
      
        if (isNaN(parsedDate)) {
          console.error("Invalid parsed date:", parsedDate);
          return null;
        }
      
        const timeZoneOffset = timeZone.offset * 60 * 1000;
        const adjustedTimestamp = parsedDate.getTime() + timeZoneOffset;
        const adjustedDate = new Date(adjustedTimestamp);
      
        console.log(
          "dateString",
          dateString,
          "timeZoneValue",
          timeZoneValue,
          "adjustedDate",
          adjustedDate
        );
      
        return adjustedDate;
      };
      
    const onOpenChange = (open) => {
        if (open) {
        setPanelOpen(true);
        setCount(0);
        } else {
        if(count!==2){  
            setTimeout(() => setPanelOpen(true), 0);
        }
        }
    };

  const onOk = () => {
    var temp = count + 1;
    console.log("temp", temp)
    if (temp === 2) {
      setPanelOpen(false);  
    }       
    setCount(temp);  
  };

  const getOffset = (timezone) => {
    const now = new Date();
    const localOffset = now.getTimezoneOffset() * 60000;
    const localNow = now - localOffset;
    const zonedNow = utcToZonedTime(localNow, timezone);
    const zonedOffset = zonedNow - localNow;
    return zonedOffset;
  };

  return (
    <ConfigProvider>
      <RangePicker
        showTime={{
          format: "HH:mm",
        }}
        renderExtraFooter={() => (
          <Footer setSelectedTimezone={setSelectedTimezone} />
        )}
        onChange={onChange}
        onOpenChange={onOpenChange}
        onOk={onOk}
        open={panelOpen}
        format="MM/DD/YYYY HH:mm:ss"
      />
    </ConfigProvider>
  );
};

export default DateTimeRangeFilter;
