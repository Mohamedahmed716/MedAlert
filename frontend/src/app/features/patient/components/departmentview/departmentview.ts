import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctors',
  templateUrl: './departmentview.html',
  imports: [CommonModule,RouterLink],
  styleUrls: ['./departmentview.css']
})
export class Departmentview {

  department = "Cardiology";

  doctors = [
    {
      name: "Dr. John Doe",
      specialty: "Interventional Cardiology",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAOoTpTAhAnOCtTDHfirUuf2M_T3jGXctiDVjGxtjY4UzNC7_T7rfwFi6XaG0orI8ordOCxxYp4kj0yjc68mjZSQvYlHGPrymvVQskoNPYku-incgYN6NrSkVBKhmLH_26MXDdovmXwOiC8_dkeFDHt4TS7jJaAv2cxhIEQi2NeAasC3-zDWcBv4UUfkhwnN3IkZCymqQSoyqP3sSHLbXdlsqY1han5nunryE9tf6YEIZNnts9t6WTwkBrBv43MqnnWgmB-4MDsoYM"
    },
    {
      name: "Dr. Jane Smith",
      specialty: "Electrophysiology",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvD68NLb-KXxqzBbjbTnsmwjTZUO97ejsasLD5L3sU0ops243tehP7_d9ZGirqyRwVM5JWE-OTHXq0ShqgKFnaNYwqDf8EDuHUOXjDDpDwIFuRZfvHrkRuqn2wVSOcz57gGQ7-yHcIZvwQQ7JUxfWee1VOHY4FuSZ1wEXiq0O1MXkXB65iSfdA_GNqpwxMQxDAxkNfe8uFNtWqIlYlghfCZdosL0SiTR4GchgSTOYfyUxDTPNJUmZLLrHB9HxDgCcEoVQxPmo7SPg"
    },
    {
      name: "Dr. Emily Jones",
      specialty: "Pediatric Cardiology",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZIDb5fiNJY-Hy_NPiDw6m1sfg9vbBjRxXdDrxc63HCCduaYxM_mgEn3UeJBo-VVKtHsPWDPgFqSPCtbZVHSQmzFAo-zpQrYLUWRvd8M5tNRTIkbFEPpfBu0BTwT_lEsJWIIe41_OafIC1AU6jHiHwS3dYWcn7go5x-R53SrE6lMt6hLpUgFzE88IC68pJT6TOUUCUHEllXhZYM5Z3gtaw9NaiTWt_IrjFtIO0azRUCPPE-4XocGlOTF7OZTJ-jR6k7dIpcbln-c"
    }
  ];

}
