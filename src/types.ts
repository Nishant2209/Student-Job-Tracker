export interface JobApplication {
    _id: string;
    company: string;
    role: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    applicationDate: Date;
    link: string;
  }
  
  export interface User {
    email: string;
  }