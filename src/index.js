import m from 'mithril'
import './demo.css'
import dateRange from '../lib/date-range-picker'

const trip = {
    location: 'Hull',
    arrivalDate: null,
    departureDate: null
}

const demo = {
    view(vnode) {
       return m('.page-date-range', [
           m(dateRange, {
               placeholder: 'Arrival/Departure',
               data: trip,
               arrivalProp: 'arrivalDate',
               departureProp: 'departureDate'
           }),
           m('.json', JSON.stringify(trip))
       ])
    }
}

m.mount(document.body, demo)

