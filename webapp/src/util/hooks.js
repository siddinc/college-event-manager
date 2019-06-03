import { useEffect, useState } from 'react';

import client from './client';

// -----

function useFileInput() {
  const [file, setFile] = useState(null);

  return {
    file,
    props: {
      type: 'file',
      onChange: (e) => {
        const { files } = e.target;
        setFile(files[0]);
      },
    },
  };
}

// -----

function useDatesManager() {
  const [dates, setDates] = useState([]);

  function addDateRange(start, end) {
    if (start.constructor !== Date) start = new Date(start);
    if (end.constructor !== Date) end = new Date(end);

    const obj = {
      start,
      end,
      allDay: false,
    };
    setDates([...dates, obj]);
  }

  function datesWithEvent(event) {
    return dates.map(e => ({ ...e, event }));
  }

  function deleteDate(i) {
    setDates(dates.filter((e, index) => i !== index));
  }

  return {
    dates,
    addDateRange,
    datesWithEvent,
    deleteDate,
  };
}

function useDepartmentManager() {
  const [depts, setDepts] = useState([]);

  function addDepartment(department) {
    const obj = {
      department,
    };
    if (!depts.find(e => e.department === department)) {
      setDepts([...depts, obj]);
    }
  }

  function deptsWithEvent(event) {
    return depts.map(e => ({ ...e, event }));
  }

  function deleteDept(i) {
    setDepts(depts.filter((e, index) => i !== index));
  }

  return {
    depts,
    addDepartment,
    deptsWithEvent,
    deleteDept,
  };
}

function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const fetchEvents = () => {
    return client.get('/event-calendar/')
      .then(r => r.data)
      .then(er => er.map((e) => {
        const start = new Date(e.start);
        const end = new Date(e.end);

        return {
          ...e,
          start,
          end,
        };
      }))
      .then(setEvents)
      .catch(console.error);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    list: events,
    fetchEvents,
  };
}

function useDayEvents(date) {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    if (!date) return null;

    const year = date.start.getYear() + 1900;
    const month = date.start.getMonth() + 1;
    const day = date.start.getDate();

    return client.get(`/event-calendar/${year}/${month}/${day}`)
      .then(r => r.data)
      .then(er => er.map(e => ({
        ...e,
        title: e.name,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: false,
      })))
      .then(setEvents)
      .catch(console.error);
  };

  useEffect(() => {
    fetchEvents();
  }, [date]);

  return {
    list: events,
    fetchEvents,
  };
}

export {
  useCalendarEvents,
  useDayEvents,
  useDatesManager,
  useDepartmentManager,
  useFileInput,
};
