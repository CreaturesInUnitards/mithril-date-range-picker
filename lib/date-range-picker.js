import m from 'mithril'
import stream from 'mithril/stream'
import './date-range-picker.css'

function prevMonth(date) {
    const newDate = new Date()
    if (date.getMonth() > 0) {
        newDate.setFullYear(date.getFullYear())
        newDate.setMonth(date.getMonth() - 1)
    } else {
        newDate.setMonth(11)
        newDate.setFullYear(date.getFullYear() - 1)
    }
    return newDate
}

function nextMonth(date) {
    const newDate = new Date()
    if (date.getMonth() < 11) {
        newDate.setFullYear(date.getFullYear())
        newDate.setMonth(date.getMonth() + 1)
    } else {
        newDate.setMonth(0)
        newDate.setFullYear(date.getFullYear() + 1)
    }
    return newDate
}

const monthsIndex = {
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
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        days.push(d);
        date.setDate(date.getDate() + 1);
    }
    return days;
}


const month = {
    onbeforeremove({ dom, state, attrs: { month, id } }) {
        const className = month() < state.initialDate ? 'right' : 'left'
        dom.classList.add('out-' + className)
        dom.parentElement.classList.add('in-' + className)
        return new Promise(resolve => {
            setTimeout(() => {
                dom.parentElement.classList.remove('in-' + className)
                resolve()
            }, 300)
        })
    },
    oninit({ state, attrs: { month, id } }) {
        state.initialDate = month()
        state.days = getDaysInMonth(month().getMonth(), month().getFullYear())
        state.startDay = state.days[0].getDay()
        state.empties = new Array(state.startDay).fill(0)
        state.id = id
    },
    view({ state, attrs: { month, id, firstDate, secondDate } }) {
        return m(`.month.month-${id}`, [
            m('h5', monthsIndex[month().getMonth()]),
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
                            firstDate,
                            secondDate
                        })
                    })
                ])
            ])
        ])
    }
}

const setDateClassName = (date, firstDate, secondDate) => {
    if (date && firstDate() && !secondDate()) {
        if (firstDate().getTime() == date.getTime() && !secondDate()) {
            return 'initial-date'
        }
    } else if (date && firstDate() && secondDate()) {
        if (firstDate().getTime() == date.getTime()) {
            return 'first-date'
        } else if (secondDate().getTime() == date.getTime()) {
            return 'second-date'
        } else if (date < secondDate() && date > firstDate()) {
            return 'in-between'
        }
    }
}

const date = {
    view({ attrs: { date, firstDate, secondDate } }) {
        return m('.date', {
            class: setDateClassName(date, firstDate, secondDate),
            onclick() {
                if (!firstDate()) {
                    firstDate(date)
                } else if (firstDate() && !secondDate()) {
                    secondDate(date)
                    const first = firstDate()
                    const second = secondDate()

                    if (second.getTime() < first.getTime()) {
                        firstDate(second)
                        secondDate(first)
                    }
                } else if (firstDate() && secondDate()) {
                    secondDate(null)
                    firstDate(date)
                }
            }
        }, [
            m('.shape'),
            m('.bg'),
            m('.number', date.getDate())
        ])
    }
}

export default {
    onremove({ state }) {
        document.removeEventListener('click', state.close)
    },
    oninit({ state, attrs: { data, arrivalProp, departureProp } }) {
        state.show = stream(false)

        state.toggle = (e) => {
            if (document.activeElement.classList.contains('date-range-input') && !state.show()) {
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

        state.firstDate = stream()
        state.secondDate = stream()

        state.secondDate.map(val => {
            if (val){
                data[arrivalProp] = state.firstDate()
                data[departureProp] = state.secondDate()
            } else {
                data[arrivalProp] = null
                data[departureProp] = null
            }
        })
    },
    view({ state: { monthOne, monthTwo, months, show, toggle, movement, firstDate, secondDate }, attrs: { placeholder } }) {
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
                    onbeforeremove({ dom }) {
                        dom.classList.add("fade-out")
                        return new Promise(resolve => {
                            setTimeout(resolve, 200)
                        })
                    }
                }, [
                        m('.triangle'),
                        m('button.previous-month.month-navigation', {
                            onclick() {
                                monthOne(prevMonth(monthOne()))
                            }
                        }, 'Prev'),

                        m('button.next-month.month-navigation', {
                            onclick() {
                                monthOne(nextMonth(monthOne()))
                            }
                        }, 'Next'),

                        m('.year', monthOne().getFullYear()),

                        m('.months-container', months().map(mon => {
                            return m(month, {
                                month: mon.month,
                                id: mon.id,
                                key: mon.key,
                                firstDate,
                                secondDate
                            })
                        }))
                    ])
            ])
    }
}