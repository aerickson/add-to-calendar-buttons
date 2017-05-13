(function() {

    var milliseconds_minute = 60000;

    var formatTime = function (date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    var calculateEndTime = function (event) {
        return event.end ? formatTime(event.end) : formatTime(new Date(event.start.getTime() + (event.duration * milliseconds_minute)));
    };

    var getData = {

        google: function (event) {

            return [
                'https://www.google.com/calendar/render?',
                'action=TEMPLATE',
                '&text=' + (encodeURI(event.title) || ''),
                '&dates=' + (formatTime(event.start) || '') + '/' + (calculateEndTime(event) || ''),
                '&details=' + (encodeURI(event.description) || ''),
                '&location=' + (encodeURI(event.location) || ''),
                '&sprop=name:'
            ].join('');

        },

        outlookOnline: function (event) {
            return [
                'https://outlook.live.com/owa/?startdt=' + (formatTime(event.start) || ''),
                '&enddt=' + (calculateEndTime(event) || ''),
                '&subject=' + encodeURI(event.title),
                '&location=' + encodeURI(event.location),
                '&body=' + encodeURI(event.description),
                '&allday=false',
                '&uid=' + event.id,
                '&path=/calendar/action/compose'
            ].join('');
        },

        yahoo: function (event) {

            var eventDuration = event.end ?
                ((event.end.getTime() - event.start.getTime()) / milliseconds_minute) :
                event.duration;

            // Convert duration from minutes to hh:mm
            var yahooHourDuration = eventDuration < 600 ?
                '0' + Math.floor((eventDuration / 60)) :
                Math.floor((eventDuration / 60)) + '';

            var yahooMinuteDuration = eventDuration % 60 < 10 ?
                '0' + eventDuration % 60 :
                eventDuration % 60 + '';

            var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

            // Remove timezone from event time
            var st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() * milliseconds_minute))) || '';

            return [
                'http://calendar.yahoo.com/?v=60&view=d&type=20',
                '&title=' + (encodeURI(event.title) || ''),
                '&st=' + st,
                '&dur=' + (yahooEventDuration || ''),
                '&desc=' + (encodeURI(event.description) || ''),
                '&in_loc=' + (encodeURI(event.location) || '')
            ].join('');
        },

        ics: function (event) {

            // See RFC at https://tools.ietf.org/html/rfc5545

            return 'data:text/calendar;charset=utf8,' +
                encodeURI([
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'BEGIN:VEVENT',
                    'UID:' + event.id,
                    'DTSTART:' + (formatTime(event.start) || ''),
                    'TRANSP:OPAQUE',
                    'DTEND:' + (calculateEndTime(event) || ''),
                    'SUMMARY:' + (event.title || ''),
                    'DESCRIPTION:' + (event.description || ''),
                    'LOCATION:' + (event.location || ''),
                    'DTSTAMP:' + formatTime(new Date()),
                    'END:VEVENT',
                    'END:VCALENDAR'
                ].join('\n'));
        }

    };


    var htmlFor = {

        google: function (event) {
            return '<a class="noncal-google" target="_blank" href="' + getData.google(event) + '">Google Calendar</a>';
        },

        outlookOnline: function (event) {
            return '<a class="noncal-outlookonline" target="_blank" href="' + getData.outlookOnline(event) + '">Outlook Online</a>';
        },

        yahoo: function (event) {
            return '<a class="noncal-yahoo" target="_blank" href="' + getData.yahoo(event) + '">Yahoo! Calendar</a>';
        },

        ics: function (event, eClass, calendarName) {
            return '<a download="calendar-' + formatTime(event.start) + '.ics" class="' + eClass + '" target="_blank" href="' + getData.ics(event) + '">' + calendarName + ' Calendar</a>';
        },

        ical: function (event) {
            return this.ics(event, 'noncal-ical', 'iCal');
        },

        outlook: function (event) {
            return this.ics(event, 'noncal-outlook', 'Outlook');
        }
    };

    var allCalendars = function (event) {
        return [
            htmlFor.google(event),
            htmlFor.yahoo(event),
            htmlFor.ical(event),
            htmlFor.outlook(event),
            htmlFor.outlookOnline(event)
        ];
    };

    window['addToCalendarButton'] = function (event, appendIn) {

        event.id = 'a' + (Math.random()*1e32).toString(15);

        var calendars = allCalendars(event);

        var html = '<span class="noncal" id="' + event.id + '">' +
                      '<a>Add to Calendar</a>' +
                      '<ul class="noncal-hide">';

                          Object.keys(calendars).forEach(function (i) {
                              html += '<li>' + calendars[i] + '</li>';
                          });

             html += '</ul>' +
                   '</span>';

        document.querySelector('#' + appendIn).innerHTML = html;

        var span = document.querySelector('#' + event.id);
        var ul   = document.querySelector('#' + event.id + ' > ul');

        span.onclick = function() {
            ul.className === 'noncal-display' ? ul.className = 'noncal-hide' : ul.className = 'noncal-display';
        };

    };

})();
