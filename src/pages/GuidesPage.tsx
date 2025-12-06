/**
 * Guides Page
 *
 * User guides for understanding and using confidential assets on Polymesh
 */

import type { Guide } from '@/data/guides';
import { findGuideById, guideCategories } from '@/data/guides';
import {
  Accordion,
  Alert,
  Anchor,
  Box,
  Container,
  Divider,
  Group,
  List,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowsExchange,
  IconBulb,
  IconChevronRight,
  IconCoin,
  IconExternalLink,
  IconInfoCircle,
  IconRocket,
  IconUserShield,
} from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Map icon names to components
const iconMap: Record<string, React.ReactNode> = {
  IconRocket: <IconRocket size={20} />,
  IconUserShield: <IconUserShield size={20} />,
  IconCoin: <IconCoin size={20} />,
  IconArrowsExchange: <IconArrowsExchange size={20} />,
};

function GuideContent({ guide }: { guide: Guide }) {
  return (
    <Stack gap="md">
      <Text>{guide.description}</Text>

      {guide.prerequisites && guide.prerequisites.length > 0 && (
        <Box>
          <Text fw={600} size="sm" mb="xs">
            What You'll Need
          </Text>
          <List size="sm" spacing="xs">
            {guide.prerequisites.map((prereq, index) => (
              <List.Item key={index}>{prereq}</List.Item>
            ))}
          </List>
        </Box>
      )}

      {/* Conceptual sections (no numbers) */}
      {guide.sections && guide.sections.length > 0 && (
        <Stack gap="sm">
          {guide.sections.map((section, index) => (
            <Paper key={index} p="sm" withBorder radius="sm">
              <Text fw={600} size="sm" mb="xs">
                {section.title}
              </Text>
              <Text size="sm" c="dimmed">
                {section.description}
              </Text>
              {section.tip && (
                <Alert
                  variant="light"
                  color="green"
                  icon={<IconBulb size={16} />}
                  mt="xs"
                  p="xs"
                >
                  <Text size="xs">{section.tip}</Text>
                </Alert>
              )}
              {section.info && (
                <Alert
                  variant="light"
                  color="blue"
                  icon={<IconInfoCircle size={16} />}
                  mt="xs"
                  p="xs"
                >
                  <Text size="xs">{section.info}</Text>
                </Alert>
              )}
              {section.warning && (
                <Alert
                  variant="light"
                  color="yellow"
                  icon={<IconAlertTriangle size={16} />}
                  mt="xs"
                  p="xs"
                >
                  <Text size="xs">{section.warning}</Text>
                </Alert>
              )}
            </Paper>
          ))}
        </Stack>
      )}

      {/* Procedural steps (numbered) */}
      {guide.steps && guide.steps.length > 0 && (
        <Box>
          <Text fw={600} size="sm" mb="xs">
            Steps
          </Text>
          <Stack gap="sm">
            {guide.steps.map((step, index) => (
              <Paper key={index} p="sm" withBorder radius="sm">
                <Group gap="sm" mb="xs" wrap="nowrap" align="flex-start">
                  <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                    <Text size="xs" fw={600}>
                      {index + 1}
                    </Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="sm">
                      {step.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {step.description}
                    </Text>
                    {step.link && (
                      <Anchor
                        href={step.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        mt={4}
                        display="block"
                      >
                        <Group gap={4}>
                          <IconExternalLink size={14} />
                          {step.link.text}
                        </Group>
                      </Anchor>
                    )}
                    {step.tip && (
                      <Alert
                        variant="light"
                        color="green"
                        icon={<IconBulb size={16} />}
                        mt="xs"
                        p="xs"
                      >
                        <Text size="xs">{step.tip}</Text>
                      </Alert>
                    )}
                    {step.info && (
                      <Alert
                        variant="light"
                        color="blue"
                        icon={<IconInfoCircle size={16} />}
                        mt="xs"
                        p="xs"
                      >
                        <Text size="xs">{step.info}</Text>
                      </Alert>
                    )}
                    {step.warning && (
                      <Alert
                        variant="light"
                        color="yellow"
                        icon={<IconAlertTriangle size={16} />}
                        mt="xs"
                        p="xs"
                      >
                        <Text size="xs">{step.warning}</Text>
                      </Alert>
                    )}
                  </Box>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {guide.behindTheScenes && (
        <Accordion variant="contained" radius="sm">
          <Accordion.Item value="behind-the-scenes">
            <Accordion.Control icon={<IconInfoCircle size={16} />}>
              <Text size="sm" fw={500}>
                What Happens Behind the Scenes
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c="dimmed">
                {guide.behindTheScenes}
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}

      {guide.learnMoreUrl && (
        <Anchor
          href={guide.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          <Group gap={4}>
            <IconExternalLink size={14} />
            {guide.learnMoreLabel || 'Learn More'}
          </Group>
        </Anchor>
      )}

      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <Box>
          <Divider my="sm" />
          <Text size="sm" fw={500} mb="xs">
            Related Guides
          </Text>
          <Group gap="xs">
            {guide.relatedGuides.map((relatedId) => {
              const result = findGuideById(relatedId);
              if (!result) return null;
              return (
                <Anchor
                  key={relatedId}
                  component={Link}
                  to={`/guides#${relatedId}`}
                  size="sm"
                  c="blue"
                >
                  <Group gap={4}>
                    <IconChevronRight size={14} />
                    {result.guide.title}
                  </Group>
                </Anchor>
              );
            })}
          </Group>
        </Box>
      )}
    </Stack>
  );
}

export function GuidesPage() {
  const location = useLocation();

  // Get the hash from URL (e.g., #creating-account)
  const targetGuideId = location.hash.slice(1);

  // Calculate which categories to open by default
  const defaultOpenCategories = useMemo(() => {
    if (targetGuideId) {
      const result = findGuideById(targetGuideId);
      if (result) {
        return result.category.id;
      }
    }
    // Default to first category open
    return 'getting-started';
  }, [targetGuideId]);

  // Calculate which guide to open by default
  const defaultOpenGuide = useMemo(() => {
    if (targetGuideId) {
      return targetGuideId;
    }
    return null;
  }, [targetGuideId]);

  // Scroll to guide when hash changes
  useEffect(() => {
    if (targetGuideId) {
      // Small delay to let accordion open
      setTimeout(() => {
        const element = document.getElementById(`guide-${targetGuideId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [targetGuideId]);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Box>
          <Title order={2} mb="xs">
            User Guides
          </Title>
          <Text c="dimmed" maw={700}>
            Learn how to use confidential assets on Polymesh. These guides cover
            everything from getting started to advanced transfer operations.
          </Text>
        </Box>

        <ScrollArea>
          <Accordion
            defaultValue={defaultOpenCategories}
            variant="separated"
            radius="md"
          >
            {guideCategories.map((category) => (
              <Accordion.Item key={category.id} value={category.id}>
                <Accordion.Control
                  icon={
                    <ThemeIcon variant="light" radius="md" size="lg">
                      {iconMap[category.icon] || <IconInfoCircle size={20} />}
                    </ThemeIcon>
                  }
                >
                  <Box>
                    <Text fw={600}>{category.title}</Text>
                    <Text size="sm" c="dimmed">
                      {category.description}
                    </Text>
                  </Box>
                </Accordion.Control>
                <Accordion.Panel>
                  <Accordion
                    defaultValue={defaultOpenGuide}
                    variant="contained"
                    radius="sm"
                  >
                    {category.guides.map((guide) => (
                      <Accordion.Item
                        key={guide.id}
                        value={guide.id}
                        id={`guide-${guide.id}`}
                      >
                        <Accordion.Control>
                          <Text fw={500}>{guide.title}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <GuideContent guide={guide} />
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </ScrollArea>
      </Stack>
    </Container>
  );
}
