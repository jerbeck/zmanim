import Foundation

struct HebcalResponse: Decodable {
    let times: [String: String]
}

enum ZmanimService {
    private static let zmanMap: [(key: String, label: String)] = [
        ("chatzotNight",  "Chatzos (Night)"),
        ("alotHaShachar", "Alos HaShachar"),
        ("dawn",          "Dawn"),
        ("sunrise",       "Sunrise"),
        ("sofZmanShma",   "Latest Shema"),
        ("sofZmanTfilla", "Latest Tefilla"),
        ("chatzot",       "Midday"),
        ("minchaGedola",  "Mincha Gedolah"),
        ("minchaKetana",  "Mincha Ketana"),
        ("plagHaMincha",  "Plag HaMincha"),
        ("sunset",        "Sunset"),
        ("dusk",          "Dusk"),
        ("tzeit42min",    "Tzeits HaKochavim"),
        ("tzeit72min",    "Tzeits HaKochavim (72 min)")
    ]

    static func fetch(latitude: Double, longitude: Double) async throws -> [ZmanimEntry] {
        let tzid = TimeZone.current.identifier
        let urlString = "https://www.hebcal.com/zmanim?cfg=json&latitude=\(latitude)&longitude=\(longitude)&tzid=\(tzid)"
        return try await fetch(urlString: urlString)
    }

    static func fetch(zip: String) async throws -> [ZmanimEntry] {
        let urlString = "https://www.hebcal.com/zmanim?cfg=json&zip=\(zip)"
        return try await fetch(urlString: urlString)
    }

    private static func fetch(urlString: String) async throws -> [ZmanimEntry] {
        guard let url = URL(string: urlString) else { throw URLError(.badURL) }
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(HebcalResponse.self, from: data)
        return zmanMap.compactMap { key, label in
            guard let iso = response.times[key], iso.count >= 16 else { return nil }
            let time = String(iso.dropFirst(11).prefix(5))
            return ZmanimEntry(label: label, time: time)
        }
    }
}
