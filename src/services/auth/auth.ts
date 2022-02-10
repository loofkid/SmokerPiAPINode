import { PassportStatic } from 'passport';
import {Strategy as IpStrategy} from 'passport-ip';
export const registerIpAuth = (passport: PassportStatic) => {
    passport.use(new IpStrategy({
        range: ['127.0.0.1/8','::1']
    }, (profile: {id: string, provider: string, displayName: string}, done: (error: Error, profile: {id: string, provider: string, displayName: string}) => {}) => {
        console.log("attempting to authenticate", profile.id)
        done(null, profile);
    }));
}