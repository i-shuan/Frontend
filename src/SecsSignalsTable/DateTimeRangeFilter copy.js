import { DatePicker, Space, ConfigProvider, Select } from 'antd';
import { isWithinInterval } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, format  } from 'date-fns-tz';
import enUS from "antd/lib/locale";
const { RangePicker } = DatePicker;


const timeZoneList = [
    { value: "UTC", label: "UTC" },
    { value: "AZ", label: "AZ" },
    { value: "TW", label: "TW" },
];


const DateTimeRangeFilter = () => {

    

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
    
    const onChange = (dates, dateStrings) => {
        console.log("日期选择结果：", dates);
        console.log("格式化日期字符串：", dateStrings);
      };
    
      const onPanelChange = (value, mode) => {
        console.log(value, mode);
      };
    
      const renderTimezoneOption = () => {
        return timeZoneList.map((timezone) => (
          <Select.Option key={timezone.value} value={timezone.value}>
            {timezone.label}
          </Select.Option>
        ));
      };
    
      return (
        <ConfigProvider locale={enUS}>
          <RangePicker
            showTime={{
              format: "HH:mm",
              renderExtraFooter: () => (
                <Select
                  defaultValue="UTC"
                  style={{ width: 120 }}
                  onChange={(timezone) => {
                    console.log("Select：", timezone);
                  }}
                >
                  {renderTimezoneOption()}
                </Select>
              ),
            }}
            onChange={onChange}
            onPanelChange={onPanelChange}
            format="MM/DD/YYYY HH:mm:ss A"
          />
        </ConfigProvider>
      );
}

export default DateTimeRangeFilter