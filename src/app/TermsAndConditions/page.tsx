"use client"

import NavBar from "../Comps/NavBar";

const TermsAndConditions = () => {
    return (
        <div>
            <NavBar />
            <div className="mx-auto w-fit">
                <div className="bg-customYellow bg-opacity-20 max-w-[70rem] tablet:my-16 p-5 flex flex-col gap-4">
                    <p className="font-bold text-3xl">Terms and Conditions</p>
                    <p>Welcome to EventEase! By using our platform, you agree to comply with the following Terms and Conditions. Please read them carefully before using our services.</p>
                    <p className="underline font-semibold">Acceptance of Terms</p>
                    <p>By accessing or using EventEase, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the platform.</p>
                    <div className="flex flex-col">
                        <p className="underline font-semibold">Use of the Platform</p>
                        <ul className="list-disc pl-5">
                            <li>Eligibility: Only faculty and students of CIT-U and individuals who have received an official invite to an event can access and use EventEase.</li>
                            <li>Account Creation: You are responsible for providing accurate information during registration and for maintaining the confidentiality of your login credentials.</li>
                            <li>User Responsibilities: You agree to use the platform for lawful purposes only and to not engage in any conduct that could harm the platform, its users, or third parties.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <p className="underline font-semibold">Event Management and Attendance</p>
                        <ul className="list-disc pl-5">
                            <li>EventEase provides tools for managing, attending, and tracking events. While we aim for accuracy, we cannot guarantee that all event-related information (including attendance tracking via QR code scanning) is error-free.</li>
                            <li>Users are responsible for ensuring their own attendance is correctly registered.</li>
                        </ul>
                    </div>
                    <p className="underline font-semibold">Intellectual Property</p>
                    <p>All content, logos, designs, and software on EventEase are the intellectual property of Wildcats Innovation Labs and may not be copied, modified, or distributed without our written permission.</p>
                    <p className="underline font-semibold">Termination</p>
                    <p>We reserve the right to suspend or terminate your access to EventEase if you violate these Terms and Conditions or engage in inappropriate behavior.</p>
                    <p className="underline font-semibold">Limitation of Liability</p>
                    <p>EventEase is provided &#34;as is&#34; and without warranties of any kind. We are not liable for any damages arising from your use of the platform, including but not limited to data loss, service interruptions, or technical issues.</p>
                    <p className="underline font-semibold">Changes to the Terms</p>
                    <p>We may update these Terms and Conditions from time to time. You will be notified of any significant changes, and continued use of the platform constitutes your acceptance of the revised terms.</p>
                    <p className="underline font-semibold">Contact Us</p>
                    <p>If you have any questions about this Terms and Conditions, please contact us at <span className="text-customYellow underline">eventease@gmail.com</span>.</p>
                    <p>By using EventEase, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</p>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditions;
