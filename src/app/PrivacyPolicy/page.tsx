"use client"

import NavBar from "../Comps/NavBar";

const PrivacyPolicy = () => {
    return (
        <div>
            <NavBar />
            <div className="bg-customYellow bg-opacity-20 max-w-[80rem] mx-auto tablet:my-16 p-5 flex flex-col gap-4">
                <p className="font-bold text-3xl">Privacy Policy</p>
                <p>EventEase (&#39;EventEase&#39;, &#39;we&#39;, &#39;us&#39;, &#39;our&#39;), are committed to protecting the privacy and security of the users&#39; personal information. This Privacy Policy explains how we collect, use, and safeguard the information you provide when using our platform for event management.</p>
                <p><strong>Please read this Privacy Policy carefully.</strong> By visiting EventEase Platform, you are consenting to the collection, processing, usage and disclosure of your Personal Information as set out in this Privacy Policy.</p>
                <div className="flex flex-col">
                    <p className="underline font-semibold">Information We Collect</p>
                    <p>We collect the following types of information:</p>
                    <ul className="list-disc pl-5">
                        <li>Personal Information: When you register on our platform, we may collect personal details  that you provide to us.</li>
                        <li>Event Data: This includes information related to the events you  attend, such as event schedules, registrations, and attendance data (including QR code scans).</li>
                        <li>Usage Data: We collect data on how you interact with the platform to improve your user experience, including log data.</li>
                    </ul>   
                </div>
                <div className="flex flex-col">
                    <p className="underline font-semibold">How We Use Your Information</p>
                    <p>The information we collect is used for the following purposes:</p>
                    <ul className="list-disc pl-5">
                        <li>To facilitate event management and registration.</li>
                        <li>To track attendance via QR code scanning.</li>
                        <li>To improve the functionality of the platform and user experience.</li>
                    </ul>   
                </div>
                <div className="flex flex-col">
                    <p className="underline font-semibold">Sharing Your Information</p>
                    <p>We do not sell or share your personal information with third parties except in the following cases:</p>
                    <ul className="list-disc pl-5">
                        <li>With event organizers for purposes related to event management.</li>
                        <li>When required by law or in response to legal requests.</li>
                    </ul>   
                </div>
                <p className="underline font-semibold">Data Security</p>
                <p>We take appropriate security measures to protect your data against unauthorized access, alteration, or disclosure. However, no system is completely secure, and we cannot guarantee the security of your information.</p>
                <p className="underline font-semibold">Your Choices</p>
                <p>You may update or delete your personal information by contacting us or through your account settings. You may also opt-out of receiving promotional emails at any time.</p>
                <p className="underline font-semibold">Changes to This Policy</p>
                <p>We may update this Privacy Policy from time to time. We will notify users of any significant changes by posting an updated version on our platform.</p>
                <p className="underline font-semibold">Contact Us</p>
                <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-customYellow underline">eventease@gmail.com</span>.</p>
                <p>By using EventEase, you agree to the collection and use of your personal information as described in this Privacy Policy. If you do not agree to this policy, please refrain from using the platform.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy;
