plugins {
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.slf4j)
    implementation(libs.logback)
    implementation(libs.metrics)

    testImplementation(libs.junit.jupiter)
    testImplementation(libs.mockito)
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

application {
    mainClass.set("reservation.kata.App")
}

tasks.named<Test>("test") {
    useJUnitPlatform()
}
