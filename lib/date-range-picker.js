import m from 'mithril'
import stream from 'mithril/stream'
import './date-range-picker.css'

function prevMonth(date){
    const newDate = new Date()
    if (date.getMonth() > 0){
        newDate.setFullYear(date.getFullYear())
        newDate.setMonth(date.getMonth() - 1)
    } else {
        newDate.setMonth(11)
        newDate.setFullYear(date.getFullYear() - 1)
    }
    return newDate
}

function nextMonth(date){
    const newDate = new Date()
    if (date.getMonth() < 11){
        newDate.setFullYear(date.getFullYear())
        newDate.setMonth(date.getMonth() + 1)
    } else {
        newDate.setMonth(0)
        newDate.setFullYear(date.getFullYear() + 1)
    }
    return newDate
}

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']

function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
       days.push(new Date(date));
       date.setDate(date.getDate() + 1);
    }
    return days;
}


const month = {
    onbeforeremove({dom, state, attrs: {month, id}}){
        return new Promise(resolve => {
            setTimeout(resolve, 300)
        })
    },
    oninit({state, attrs: {month, id}}){
        state.initialDate = month()
        state.days = getDaysInMonth(month().getMonth(), month().getFullYear())
        state.startDay = state.days[0].getDay()
        state.empties = new Array(state.startDay).fill(0)
        state.id = id
    },
    view ({state, attrs: {month, id, arrival, departure}}) {
        return m(`.month.month-${id}`, [
            m('h5', months[month().getMonth()]),
            m('.month-grid', [
                m('.days', days.map(d => {
                    return m('.day', d)
                })),
                m('.dates', [
                    state.empties.map(() => {
                        return m('.empty-date')
                    }),
                    state.days.map(d => {
                        return m(date, {
                            date: d,
                            arrival,
                            departure
                        })
                    })
                ])
            ])
        ])
    }
}

const createDateClass = (d, a, dep) => {
    const date = d.setHours(0,0,0,0)
    const arrival = a() ? a().setHours(0,0,0,0) : ''
    const departure = dep() ? dep().setHours(0,0,0,0) : ''
    if (date == arrival){
        return 'arrival'
    } else if (date == departure){
        return 'departure'
    }
    if (date > arrival && date < departure){
        return 'selected'
    }
}

const date = {
    view({attrs: {date, arrival, departure}}){
        return m('.date', {
            class: createDateClass(date, arrival, departure),
            onclick(){
                if (!arrival()){
                    arrival(date)
                } else if (arrival() && !departure()){
                    departure(date)
                } else if (arrival() && departure()){
                    arrival(date)
                    departure(null)
                }
            }
        }, date.getDate())
    }
}

export default {
    onremove({state}){
        document.removeEventListener('click', state.close)
    },
    oninit({state, attrs: {data, arrivalProp, departureProp}}){
        state.show = stream(false)

        state.toggle = (e) => {
            if (document.activeElement.classList.contains('date-range-input') && !state.show()){
                state.show(!state.show())
                m.redraw()
            }
        }

        state.close = () => {
            state.show(false)
            m.redraw()
        }

        document.addEventListener('click', state.close)

        const date = new Date()
        date.setDate(1)
        date.setHours(0,0,0,0)

        state.monthOne = stream(date)
        state.monthTwo = state.monthOne.map(() => {
            return nextMonth(state.monthOne())
        })

        state.months = state.monthTwo.map(() => {
            return [
                {
                    month: state.monthOne,
                    id: '1',
                    key: state.monthOne().getTime(),
                },
                {
                    month: state.monthTwo,
                    id: '2',
                    key: state.monthTwo().getTime(),
                }
            ]
        })

        state.setMovement = (dir) => {
            state.movement = dir
            setTimeout(() => {
                state.movement = ''
                m.redraw()
            }, 300)
        }

        state.arrival = date => {
            if (date !== undefined){
                data[arrivalProp] = date
            } else {
                return data[arrivalProp]
            }
        }

        state.departure = date => {
            if (date !== undefined){
                data[departureProp] = date
            } else {
                return data[departureProp]
            }
        }
    },
    view ({state: {monthOne, monthTwo, months, show, toggle, movement, setMovement, arrival, departure}, attrs: {placeholder}}) {
        return m('.date-range', {
            onclick: e => e.stopPropagation() 
        }, [
            m('input.date-range-input', {
                class: show() ? 'focus' : '',
                placeholder,
                onclick: toggle,
                onfocus: toggle
            }),
            //show() &&
            m('.calendar-display', {
                onbeforeremove({dom}){
                    dom.classList.add("fade-out")
                    return new Promise(resolve => {
                        setTimeout(resolve, 200)
                    })
                }
            }, [
                m('button.previous-month.month-navigation', {
                    onclick(){
                        monthOne(prevMonth(monthOne()))
                        setMovement('right')
                    }
                }, 'Prev'),

                m('button.next-month.month-navigation', {
                    onclick(){
                        monthOne(nextMonth(monthOne()))
                        setMovement('left')
                    }
                }, 'Next'),

                m('.year', monthOne().getFullYear()),
                m('.months-container', {
                    class: movement
                }, months().map(mon => {
                    return m(month, {
                        month: mon.month,
                        id: mon.id, 
                        key: mon.key,
                        arrival,
                        departure
                    })
                })),
 

            ])
        ])
    }
}